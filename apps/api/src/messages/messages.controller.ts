import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateConversationDto, SendMessageDto } from './dto/messages.dto';
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
  createConversation(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateConversationDto,
  ) {
    return this.messagesService.createConversation(user.sub, dto.peerId);
  }

  @Get('conversations/:id/messages')
  messages(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.messagesService.messages(user.sub, id);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.messagesService.sendMessage(user.sub, id, dto);
    this.messagesGateway.emitMessage(id, message);
    return message;
  }
}
