import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Get('conversations')
  conversations(@CurrentUser() user: { sub: string }) {
    return this.messagesService.conversations(user.sub);
  }

  @Post('conversations')
  createConversation(@CurrentUser() user: { sub: string }, @Body() body: { peerId: string }) {
    return this.messagesService.createConversation(user.sub, body.peerId);
  }

  @Get('conversations/:id/messages')
  messages(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.messagesService.messages(user.sub, id);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    const message = await this.messagesService.sendMessage(user.sub, id, body.content);
    this.messagesGateway.emitMessage(id, message);
    return message;
  }
}
