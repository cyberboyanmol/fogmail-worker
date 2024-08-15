import { Global, Module } from '@nestjs/common';
import { PrismaRepository, PrismaService } from './prisma.service';
import { InboxRepository } from '../repositories/inbox/inbox.repository';
import { ConversationRepository } from '../repositories/conversation/conversation.respository';
import { MessageRepository } from '../repositories/messages/message.repository';
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaRepository,
    PrismaService,
    InboxRepository,
    ConversationRepository,
    MessageRepository,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
