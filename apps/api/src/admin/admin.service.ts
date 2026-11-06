import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  reports() {
    return this.prisma.report.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        reportedUser: {
          select: {
            id: true,
            username: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        post: {
          select: { id: true, authorId: true, content: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReportStatus(id: string, status: ReportStatus) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  removePost(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }

  manageGroups() {
    return this.prisma.group.findMany({ include: { _count: { select: { members: true, posts: true } } } });
  }

  verifyMember(userId: string, isVerified: boolean) {
    return this.prisma.user.update({ where: { id: userId }, data: { isVerified } });
  }
}
