import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitApplicationDto } from './dto/applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  submit(userId: string | null, dto: SubmitApplicationDto) {
    return this.prisma.application.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  me(email: string) {
    return this.prisma.application.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
  }

  adminList(status?: ApplicationStatus) {
    return this.prisma.application.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async review(applicationId: string, reviewerId: string, status: ApplicationStatus, reviewNotes?: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status, reviewNotes, reviewedByUserId: reviewerId },
    });

    if (app.userId && status === ApplicationStatus.APPROVED) {
      await this.prisma.user.update({ where: { id: app.userId }, data: { isApproved: true, isVerified: true } });
    }

    if (app.userId && status === ApplicationStatus.DENIED) {
      await this.prisma.user.update({ where: { id: app.userId }, data: { isApproved: false } });
    }

    return updated;
  }
}
