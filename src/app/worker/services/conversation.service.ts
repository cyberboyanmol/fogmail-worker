import { Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { ParsedMail } from 'mailparser';
import { ConversationRepository } from 'src/libraries/dal/repositories/conversation/conversation.respository';

@Injectable()
export class ConversationService {
  constructor(private _conversationRepository: ConversationRepository) {}
  public async findByThreadId(data: Partial<Conversation>) {
    return this._conversationRepository.find({
      threadId: data.threadId,
      emailusername: data.emailusername,
    });
  }

  public async createConversation(data: {
    parsedEmail: ParsedMail;
    username: string;
  }) {
    return this._conversationRepository.create({
      subject: data.parsedEmail.subject,
      emailusername: data.username,
      threadId: data.parsedEmail.messageId,
    });
  }
}
