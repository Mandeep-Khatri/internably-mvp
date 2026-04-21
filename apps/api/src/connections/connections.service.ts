import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConnectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async request(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new BadRequestException('Cannot connect to yourself');
    const blocked = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: userId },
        ],
      },
    });
    if (blocked) throw new ForbiddenException('Unable to connect with this user');
    const request = await this.prisma.connectionRequest.upsert({
      where: { fromUserId_toUserId: { fromUserId: userId, toUserId: targetUserId } },
      update: { status: 'PENDING' },
      create: { fromUserId: userId, toUserId: targetUserId },
    });
    await this.notificationsService.create(
      targetUserId,
      NotificationType.CONNECTION_REQUEST,
      'New connection request',
      'Someone wants to connect with you on Internably.',
      request.id,
      { kind: 'connection_request', requestId: request.id },
    );
    return request;
  }

  async accept(userId: string, requestId: string) {
    const request = await this.prisma.connectionRequest.findUnique({ where: { id: requestId } });
    if (!request || request.toUserId !== userId) throw new NotFoundException('Request not found');

    const userAId = request.fromUserId < request.toUserId ? request.fromUserId : request.toUserId;
    const userBId = request.fromUserId < request.toUserId ? request.toUserId : request.fromUserId;

    await this.prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } });
    await this.prisma.connection.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      update: {},
      create: { userAId, userBId },
    });
    await this.notificationsService.create(
      request.fromUserId,
      NotificationType.CONNECTION_ACCEPTED,
      'Connection request accepted',
      'Your connection request was accepted.',
      request.id,
      { kind: 'connection_accepted', requestId: request.id },
    );

    return { success: true };
  }

  async decline(userId: string, requestId: string) {
    const request = await this.prisma.connectionRequest.findUnique({ where: { id: requestId } });
    if (!request || request.toUserId !== userId) throw new NotFoundException('Request not found');
    await this.prisma.connectionRequest.update({ where: { id: requestId }, data: { status: 'DECLINED' } });
    return { success: true };
  }

  async remove(userId: string, otherUserId: string) {
    const userAId = userId < otherUserId ? userId : otherUserId;
    const userBId = userId < otherUserId ? otherUserId : userId;
    await this.prisma.connection.deleteMany({ where: { userAId, userBId } });
    return { success: true };
  }

  async block(userId: string, targetUserId: string, reason: string) {
    if (userId === targetUserId) throw new BadRequestException('Cannot block yourself');
    await this.prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: targetUserId } },
      update: { reason },
      create: { blockerId: userId, blockedId: targetUserId, reason },
    });

    const userAId = userId < targetUserId ? userId : targetUserId;
    const userBId = userId < targetUserId ? targetUserId : userId;
    await this.prisma.connection.deleteMany({ where: { userAId, userBId } });
    await this.prisma.connectionRequest.deleteMany({
      where: {
        OR: [
          { fromUserId: userId, toUserId: targetUserId },
          { fromUserId: targetUserId, toUserId: userId },
        ],
      },
    });

    return { success: true };
  }

  list(userId: string) {
    return this.prisma.connection.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });
  }

  incoming(userId: string) {
    return this.prisma.connectionRequest.findMany({
      where: { toUserId: userId, status: 'PENDING' },
      include: { fromUser: { include: { profile: true } } },
    });
  }

  outgoing(userId: string) {
    return this.prisma.connectionRequest.findMany({
      where: { fromUserId: userId, status: 'PENDING' },
      include: { toUser: { include: { profile: true } } },
    });
  }
}
