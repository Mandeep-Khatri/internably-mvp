import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageType, NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendMessageDto } from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  conversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { include: { user: { include: { profile: true } } } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sharedPost: { select: { id: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createConversation(userId: string, peerId: string) {
    await this.assertCanMessage(userId, peerId);

    const candidates = await this.prisma.conversation.findMany({
      where: {
        AND: [
          { members: { some: { userId } } },
          { members: { some: { userId: peerId } } },
        ],
      },
      include: { members: true },
    });
    const existing = candidates.find(
      (conversation) =>
        conversation.members.length === 2 &&
        conversation.members.some((member) => member.userId === userId) &&
        conversation.members.some((member) => member.userId === peerId),
    );
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        members: {
          create: [{ userId }, { userId: peerId }],
        },
      },
      include: { members: true },
    });
  }

  async messages(userId: string, conversationId: string) {
    const membership = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!membership) throw new NotFoundException('Conversation not found');

    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { include: { profile: true } },
        sharedPost: {
          include: {
            author: { include: { profile: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    dto: SendMessageDto,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { members: true },
    });
    if (!conversation || !conversation.members.some((member) => member.userId === userId)) {
      throw new NotFoundException('Conversation not found');
    }

    const peerIds = conversation.members
      .map((member) => member.userId)
      .filter((memberId) => memberId !== userId);
    if (!peerIds.length) throw new BadRequestException('Conversation has no recipient');

    await Promise.all(peerIds.map((peerId) => this.assertCanMessage(userId, peerId)));

    const content = dto.content?.trim() ?? '';
    const sharedPostId = dto.sharedPostId?.trim() || undefined;
    if (!content && !sharedPostId) {
      throw new BadRequestException('Message content or a shared post is required');
    }
    if (content.length > 4000) {
      throw new BadRequestException('Message content is too long');
    }

    if (sharedPostId) {
      const post = await this.prisma.post.findUnique({
        where: { id: sharedPostId },
        select: { id: true },
      });
      if (!post) throw new NotFoundException('Post not found');
    }

    const isPostShare = Boolean(sharedPostId);
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        type: isPostShare ? MessageType.POST_SHARE : MessageType.TEXT,
        content: content || 'Shared a post',
        sharedPostId: sharedPostId ?? null,
      },
      include: {
        sender: { include: { profile: true } },
        sharedPost: {
          include: {
            author: { include: { profile: true } },
          },
        },
      },
    });

    await this.notificationsService.createMany(
      peerIds.map((peerId) => ({
        userId: peerId,
        type: NotificationType.MESSAGE,
        title: isPostShare ? 'New shared post' : 'New message',
        body: isPostShare
          ? 'A connection shared a post with you.'
          : message.content.length > 80
            ? message.content.slice(0, 80) + '...'
            : message.content,
        entityId: conversationId,
        pushData: { kind: 'message', conversationId },
      })),
    );

    return message;
  }

  private async assertCanMessage(userId: string, peerId: string) {
    if (userId === peerId) {
      throw new BadRequestException('Cannot message yourself');
    }

    const userAId = userId < peerId ? userId : peerId;
    const userBId = userId < peerId ? peerId : userId;
    const [connection, blocked] = await Promise.all([
      this.prisma.connection.findUnique({
        where: { userAId_userBId: { userAId, userBId } },
        select: { id: true },
      }),
      this.prisma.block.findFirst({
        where: {
          OR: [
            { blockerId: userId, blockedId: peerId },
            { blockerId: peerId, blockedId: userId },
          ],
        },
        select: { id: true },
      }),
    ]);

    if (!connection || blocked) {
      throw new ForbiddenException('You can only message accepted connections');
    }
  }
}
