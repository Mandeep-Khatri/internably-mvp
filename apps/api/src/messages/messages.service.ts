import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

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
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createConversation(userId: string, peerId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { members: { some: { userId } } },
          { members: { some: { userId: peerId } } },
        ],
      },
      include: { members: true },
    });
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
      include: { sender: { include: { profile: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    const membership = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!membership) throw new NotFoundException('Conversation not found');

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
      include: { sender: { include: { profile: true } } },
    });

    const recipients = await this.prisma.conversationMember.findMany({
      where: {
        conversationId,
        userId: { not: userId },
      },
      select: { userId: true },
    });
    await this.notificationsService.createMany(
      recipients.map((recipient) => ({
        userId: recipient.userId,
        type: NotificationType.MESSAGE,
        title: 'New message',
        body: message.content.length > 80 ? `${message.content.slice(0, 80)}...` : message.content,
        entityId: conversationId,
        pushData: { kind: 'message', conversationId },
      })),
    );

    return message;
  }
}
