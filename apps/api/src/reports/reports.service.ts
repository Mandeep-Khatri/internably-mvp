import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async reportUser(
    reporterId: string,
    reportedUserId: string,
    dto: CreateReportDto,
  ) {
    if (reporterId === reportedUserId) {
      throw new BadRequestException('You cannot report your own account');
    }

    const reportedUser = await this.prisma.user.findUnique({
      where: { id: reportedUserId },
      select: { id: true },
    });
    if (!reportedUser) throw new NotFoundException('User not found');

    const existing = await this.prisma.report.findFirst({
      where: {
        reporterId,
        reportedUserId,
        postId: null,
        status: ReportStatus.OPEN,
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('You already submitted a report for this user');
    }

    return this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason: dto.reason,
        details: dto.details?.trim() || null,
      },
      select: { id: true, status: true, createdAt: true },
    });
  }

  async reportPost(reporterId: string, postId: string, dto: CreateReportDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId === reporterId) {
      throw new BadRequestException('You cannot report your own post');
    }

    const existing = await this.prisma.report.findFirst({
      where: {
        reporterId,
        postId,
        status: ReportStatus.OPEN,
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('You already submitted a report for this post');
    }

    return this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: post.authorId,
        postId,
        reason: dto.reason,
        details: dto.details?.trim() || null,
      },
      select: { id: true, status: true, createdAt: true },
    });
  }
}
