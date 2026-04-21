import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { RegisterPushTokenDto, RemovePushTokenDto } from './dto/push-token.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.notificationsService.list(user.sub);
  }

  @Patch(':id/read')
  read(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.notificationsService.read(user.sub, id);
  }

  @Patch('read-all')
  readAll(@CurrentUser() user: { sub: string }) {
    return this.notificationsService.readAll(user.sub);
  }

  @Post('push-token')
  registerPushToken(@CurrentUser() user: { sub: string }, @Body() dto: RegisterPushTokenDto) {
    return this.notificationsService.registerPushToken(user.sub, dto.token, dto.platform);
  }

  @Delete('push-token')
  removePushToken(@CurrentUser() user: { sub: string }, @Body() dto: RemovePushTokenDto) {
    return this.notificationsService.removePushToken(user.sub, dto.token);
  }
}
