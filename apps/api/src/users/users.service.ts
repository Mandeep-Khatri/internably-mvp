import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMeDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            school: true,
            company: true,
            interests: { include: { interest: true } },
          },
        },
      },
    });
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!user || !user.profile) throw new NotFoundException('Profile not found');

    let schoolId: string | undefined;
    if (dto.school) {
      const school = await this.prisma.school.upsert({
        where: { name: dto.school },
        create: { name: dto.school },
        update: {},
      });
      schoolId = school.id;
    }

    let companyId: string | undefined;
    if (dto.internshipCompany) {
      const company = await this.prisma.company.upsert({
        where: { name: dto.internshipCompany },
        create: { name: dto.internshipCompany },
        update: {},
      });
      companyId = company.id;
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        pronouns: dto.pronouns,
        headline: dto.headline,
        bio: dto.bio,
        schoolId,
        major: dto.major,
        degree: dto.degree,
        graduationYear: dto.graduationYear,
        city: dto.city,
        companyId,
        linkedinUrl: dto.linkedinUrl,
        avatarUrl: dto.avatarUrl,
        bannerUrl: dto.bannerUrl,
        openToNetwork: dto.openToNetwork,
        openToInternship: dto.openToInternship,
      },
      include: { school: true, company: true, interests: { include: { interest: true } } },
    });

    if (dto.interests) {
      await this.prisma.userInterest.deleteMany({ where: { profileId: updated.id } });
      for (const name of dto.interests) {
        const interest = await this.prisma.interest.upsert({ where: { name }, create: { name }, update: {} });
        await this.prisma.userInterest.create({
          data: { userId, profileId: updated.id, interestId: interest.id },
        });
      }
    }

    return this.me(userId);
  }

  async search(query: Record<string, string | undefined>) {
    const q = query.q?.trim();
    const where: Prisma.UserWhereInput = {
      isApproved: true,
      profile: {
        is: {
          major: query.major,
          city: query.city,
          graduationYear: query.graduationYear ? Number(query.graduationYear) : undefined,
          openToInternship: query.openToInternship === 'true' ? true : undefined,
          openToNetwork: query.openToNetwork === 'true' ? true : undefined,
          OR: q
            ? [
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { headline: { contains: q, mode: 'insensitive' } },
              ]
            : undefined,
        },
      },
    };

    return this.prisma.user.findMany({
      where,
      include: { profile: { include: { school: true, company: true } } },
      take: 50,
    });
  }

  async suggestions(userId: string) {
    const me = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
    if (!me?.profile) return [];
    const myProfile = me.profile;

    const connected = await this.prisma.connection.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: { userAId: true, userBId: true },
    });

    const pendingRequests = await this.prisma.connectionRequest.findMany({
      where: {
        status: 'PENDING',
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      select: { fromUserId: true, toUserId: true },
    });

    const excludedUserIds = new Set<string>([userId]);
    for (const edge of connected) {
      excludedUserIds.add(edge.userAId);
      excludedUserIds.add(edge.userBId);
    }
    for (const req of pendingRequests) {
      excludedUserIds.add(req.fromUserId);
      excludedUserIds.add(req.toUserId);
    }

    const overlapCandidates = await this.prisma.user.findMany({
      where: {
        id: { notIn: [...excludedUserIds] },
        isApproved: true,
        isVerified: true,
        profile: { is: { openToNetwork: true } },
        OR: [
          { profile: { schoolId: myProfile.schoolId ?? undefined } },
          { profile: { city: myProfile.city ?? undefined } },
          { profile: { major: myProfile.major ?? undefined } },
          { profile: { companyId: myProfile.companyId ?? undefined } },
        ],
      },
      include: { profile: { include: { school: true, company: true } } },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    // Score overlap matches so the most relevant peers appear first.
    const scoredOverlap = overlapCandidates
      .map((user) => {
        const profile = user.profile;
        if (!profile) return { user, score: 0 };
        let score = 0;
        if (myProfile.schoolId && profile.schoolId === myProfile.schoolId) score += 4;
        if (myProfile.major && profile.major === myProfile.major) score += 3;
        if (myProfile.city && profile.city === myProfile.city) score += 2;
        if (myProfile.companyId && profile.companyId === myProfile.companyId) score += 1;
        return { user, score };
      })
      .sort((a, b) => b.score - a.score);

    const suggestions = scoredOverlap.map((s) => s.user).slice(0, 20);

    if (suggestions.length < 20) {
      const fallback = await this.prisma.user.findMany({
        where: {
          id: { notIn: [...new Set([...excludedUserIds, ...suggestions.map((u) => u.id)])] },
          isApproved: true,
          isVerified: true,
          profile: { is: { openToNetwork: true } },
        },
        include: { profile: { include: { school: true, company: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20 - suggestions.length,
      });

      suggestions.push(...fallback);
    }

    return suggestions;
  }

  async profileById(requesterId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: { include: { school: true, company: true, interests: { include: { interest: true } } } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const connections = await this.prisma.connection.findMany({
      where: { OR: [{ userAId: id }, { userBId: id }] },
      select: { userAId: true, userBId: true },
    });
    const peerIds = new Set<string>();
    for (const edge of connections) {
      peerIds.add(edge.userAId === id ? edge.userBId : edge.userAId);
    }

    const myConnections = await this.prisma.connection.findMany({
      where: { OR: [{ userAId: requesterId }, { userBId: requesterId }] },
      select: { userAId: true, userBId: true },
    });
    const myPeerIds = new Set<string>();
    for (const edge of myConnections) {
      myPeerIds.add(edge.userAId === requesterId ? edge.userBId : edge.userAId);
    }

    let mutualConnectionsCount = 0;
    for (const peerId of peerIds) {
      if (myPeerIds.has(peerId)) mutualConnectionsCount += 1;
    }

    return {
      ...user,
      connectionsCount: peerIds.size,
      mutualConnectionsCount,
    };
  }
}
