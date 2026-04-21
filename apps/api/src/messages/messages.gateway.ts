import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesGateway {
  emitMessage(_conversationId: string, _message: unknown) {
    // Realtime socket broadcasting can be wired here when @nestjs/websockets is enabled.
  }
}
