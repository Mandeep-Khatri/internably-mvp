import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ApplicationsModule } from './applications/applications.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { PostsModule } from './posts/posts.module';
import { ConnectionsModule } from './connections/connections.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ApplicationsModule,
    UsersModule,
    GroupsModule,
    PostsModule,
    ConnectionsModule,
    MessagesModule,
    NotificationsModule,
    AdminModule,
    MediaModule,
  ],
})
export class AppModule {}
