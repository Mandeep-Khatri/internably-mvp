import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConnectionsService } from './connections.service';
import { BlockUserDto } from './dto/connections.dto';

@Controller('connections')
@UseGuards(JwtAuthGuard)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('request/:userId')
  request(@CurrentUser() user: { sub: string }, @Param('userId') userId: string) {
    return this.connectionsService.request(user.sub, userId);
  }

  @Post('accept/:requestId')
  accept(@CurrentUser() user: { sub: string }, @Param('requestId') requestId: string) {
    return this.connectionsService.accept(user.sub, requestId);
  }

  @Post('decline/:requestId')
  decline(@CurrentUser() user: { sub: string }, @Param('requestId') requestId: string) {
    return this.connectionsService.decline(user.sub, requestId);
  }

  @Delete(':userId')
  remove(@CurrentUser() user: { sub: string }, @Param('userId') userId: string) {
    return this.connectionsService.remove(user.sub, userId);
  }

  @Post('block/:userId')
  block(@CurrentUser() user: { sub: string }, @Param('userId') userId: string, @Body() dto: BlockUserDto) {
    return this.connectionsService.block(user.sub, userId, dto.reason);
  }

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.connectionsService.list(user.sub);
  }

  @Get('requests/incoming')
  incoming(@CurrentUser() user: { sub: string }) {
    return this.connectionsService.incoming(user.sub);
  }

  @Get('requests/outgoing')
  outgoing(@CurrentUser() user: { sub: string }) {
    return this.connectionsService.outgoing(user.sub);
  }
}
