import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  const prisma = {
    user: { findUnique: jest.fn() },
    post: { findUnique: jest.fn() },
    report: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  let service: ReportsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReportsService(prisma as unknown as PrismaService);
  });

  it('creates a post report linked to the post author', async () => {
    prisma.post.findUnique.mockResolvedValue({ id: 'post-1', authorId: 'user-b' });
    prisma.report.findFirst.mockResolvedValue(null);
    prisma.report.create.mockResolvedValue({ id: 'report-1', status: 'OPEN' });

    await service.reportPost('user-a', 'post-1', {
      reason: 'SPAM',
      details: 'Repeated promotions',
    });

    expect(prisma.report.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          reporterId: 'user-a',
          reportedUserId: 'user-b',
          postId: 'post-1',
          reason: 'SPAM',
        }),
      }),
    );
  });

  it('rejects reporting your own post', async () => {
    prisma.post.findUnique.mockResolvedValue({ id: 'post-1', authorId: 'user-a' });

    await expect(
      service.reportPost('user-a', 'post-1', { reason: 'OTHER' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.report.create).not.toHaveBeenCalled();
  });

  it('prevents duplicate open user reports', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-b' });
    prisma.report.findFirst.mockResolvedValue({ id: 'report-existing' });

    await expect(
      service.reportUser('user-a', 'user-b', { reason: 'HARASSMENT' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.report.create).not.toHaveBeenCalled();
  });
});
