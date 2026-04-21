import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  read(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  readAll(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  registerPushToken(userId: string, token: string, platform?: string) {
    return this.prisma.pushDevice.upsert({
      where: { token },
      update: {
        userId,
        platform,
        lastSeenAt: new Date(),
      },
      create: {
        userId,
        token,
        platform,
      },
    });
  }

  removePushToken(userId: string, token: string) {
    return this.prisma.pushDevice.deleteMany({
      where: { userId, token },
    });
  }

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    entityId?: string,
    pushData?: Record<string, string>,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        entityId,
      },
    });
    await this.sendPushToUsers([userId], title, body, pushData);
    return notification;
  }

  async createMany(
    entries: Array<{
      userId: string;
      type: NotificationType;
      title: string;
      body: string;
      entityId?: string;
      pushData?: Record<string, string>;
    }>,
  ) {
    if (entries.length === 0) return { count: 0 };
    const created = await Promise.all(
      entries.map((entry) =>
        this.prisma.notification.create({
          data: {
            userId: entry.userId,
            type: entry.type,
            title: entry.title,
            body: entry.body,
            entityId: entry.entityId,
          },
        }),
      ),
    );

    for (const entry of entries) {
      await this.sendPushToUsers([entry.userId], entry.title, entry.body, entry.pushData);
    }
    return { count: created.length };
  }

  private async sendPushToUsers(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    if (userIds.length === 0) return;
    const provider = (process.env.PUSH_PROVIDER || 'mock').toLowerCase();
    const devices = await this.prisma.pushDevice.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });
    const tokens = devices.map((d) => d.token);
    if (tokens.length === 0) return;

    if (provider !== 'expo') {
      console.log(`[Push:${provider}]`, { tokensCount: tokens.length, title, body, data });
      return;
    }

    const messages = tokens.map((to) => ({
      to,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    }));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const accessToken = process.env.EXPO_PUSH_ACCESS_TOKEN;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(messages),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('[Push:expo] failed', response.status, text);
      }
    } catch (error) {
      console.error('[Push:expo] error', error);
    }
  }
}
