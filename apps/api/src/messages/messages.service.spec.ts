import { ForbiddenException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  const prisma = {
    block: { findFirst: jest.fn() },
    connection: { findUnique: jest.fn() },
    conversation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    conversationMember: { findUnique: jest.fn() },
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    post: { findUnique: jest.fn() },
  };
  const notifications = { createMany: jest.fn() };

  let service: MessagesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MessagesService(
      prisma as unknown as PrismaService,
      notifications as unknown as NotificationsService,
    );
  });

  it('rejects conversations with users who are not accepted connections', async () => {
    prisma.connection.findUnique.mockResolvedValue(null);
    prisma.block.findFirst.mockResolvedValue(null);

    await expect(service.createConversation('user-a', 'user-b')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.conversation.create).not.toHaveBeenCalled();
  });

  it('creates a post-share message for an accepted connection', async () => {
    prisma.conversation.findUnique.mockResolvedValue({
      id: 'conversation-1',
      members: [{ userId: 'user-a' }, { userId: 'user-b' }],
    });
    prisma.connection.findUnique.mockResolvedValue({ id: 'connection-1' });
    prisma.block.findFirst.mockResolvedValue(null);
    prisma.post.findUnique.mockResolvedValue({ id: 'post-1' });
    prisma.message.create.mockResolvedValue({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderId: 'user-a',
      type: 'POST_SHARE',
      content: 'Shared a post',
      sharedPostId: 'post-1',
      sharedPost: { id: 'post-1' },
    });
    notifications.createMany.mockResolvedValue(undefined);

    const result = await service.sendMessage('user-a', 'conversation-1', {
      sharedPostId: 'post-1',
    });

    expect(prisma.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'POST_SHARE',
          sharedPostId: 'post-1',
        }),
      }),
    );
    expect(notifications.createMany).toHaveBeenCalledWith([
      expect.objectContaining({
        userId: 'user-b',
        body: 'A connection shared a post with you.',
      }),
    ]);
    expect(result.sharedPostId).toBe('post-1');
  });

  it('rejects a share when either user has blocked the other', async () => {
    prisma.conversation.findUnique.mockResolvedValue({
      id: 'conversation-1',
      members: [{ userId: 'user-a' }, { userId: 'user-b' }],
    });
    prisma.connection.findUnique.mockResolvedValue({ id: 'connection-1' });
    prisma.block.findFirst.mockResolvedValue({ id: 'block-1' });

    await expect(
      service.sendMessage('user-a', 'conversation-1', { sharedPostId: 'post-1' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.message.create).not.toHaveBeenCalled();
  });
});
