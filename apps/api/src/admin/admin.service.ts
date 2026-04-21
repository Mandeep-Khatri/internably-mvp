import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  reports() {
    return this.prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
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
