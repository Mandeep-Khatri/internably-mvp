import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/groups.dto';

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  list(query?: { type?: string; q?: string }) {
    return this.prisma.group.findMany({
      where: {
        type: query?.type as never,
        name: query?.q ? { contains: query.q, mode: 'insensitive' } : undefined,
      },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(ownerId: string, dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: dto.name,
        slug: `${slugify(dto.name)}-${Date.now().toString().slice(-4)}`,
        type: dto.type,
        description: dto.description,
        bannerUrl: dto.bannerUrl,
        ownerId,
        members: {
          create: { userId: ownerId, isModerator: true },
        },
      },
      include: { _count: { select: { members: true } } },
    });
  }

  detail(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        _count: { select: { members: true, posts: true } },
      },
    });
  }

  async join(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');
    return this.prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      update: {},
      create: { groupId, userId },
    });
  }

  leave(groupId: string, userId: string) {
    return this.prisma.groupMember.deleteMany({ where: { groupId, userId } });
  }

  members(groupId: string) {
    return this.prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  groupPosts(groupId: string) {
    return this.prisma.post.findMany({
      where: { groupId },
      include: {
        author: { include: { profile: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
