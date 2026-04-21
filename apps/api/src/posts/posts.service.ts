import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto, CreatePostDto, UpdatePostDto } from './dto/posts.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async feed(userId: string) {
    const connections = await this.prisma.connection.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
    });
    const connectedIds = new Set<string>([userId]);
    for (const connection of connections) {
      connectedIds.add(connection.userAId === userId ? connection.userBId : connection.userAId);
    }

    const memberships = await this.prisma.groupMember.findMany({ where: { userId }, select: { groupId: true } });
    const groupIds = memberships.map((m) => m.groupId);

    return this.prisma.post.findMany({
      where: {
        OR: [
          { authorId: { in: [...connectedIds] } },
          { groupId: { in: groupIds } },
        ],
      },
      include: {
        author: { include: { profile: true } },
        group: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  create(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        authorId: userId,
        content: dto.content,
        imageUrl: dto.imageUrl,
        groupId: dto.groupId,
      },
      include: {
        author: { include: { profile: true } },
        group: true,
      },
    });
  }

  getById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { include: { profile: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async update(postId: string, userId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Not your post');
    return this.prisma.post.update({ where: { id: postId }, data: dto });
  }

  async delete(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Not your post');
    await this.prisma.post.delete({ where: { id: postId } });
    return { success: true };
  }

  async like(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) return existing;

    const like = await this.prisma.like.create({
      data: { postId, userId },
    });
    if (post.authorId !== userId) {
      await this.notificationsService.create(
        post.authorId,
        NotificationType.POST_LIKE,
        'New like',
        'Someone liked your post.',
        postId,
        { kind: 'post_like', postId },
      );
    }
    return like;
  }

  unlike(postId: string, userId: string) {
    return this.prisma.like.deleteMany({ where: { postId, userId } });
  }

  async comment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        authorId: userId,
        content: dto.content,
      },
      include: { author: { include: { profile: true } } },
    });
    if (post.authorId !== userId) {
      await this.notificationsService.create(
        post.authorId,
        NotificationType.POST_COMMENT,
        'New comment',
        'Someone commented on your post.',
        postId,
        { kind: 'post_comment', postId },
      );
    }
    return comment;
  }

  comments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { author: { include: { profile: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
