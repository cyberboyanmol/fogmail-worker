import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private _conversation: PrismaRepository<'conversation'>) {}

  async create(data: Partial<Conversation>) {
    return this._conversation.model.conversation.create({
      data: {
        subject: data.subject,
        threadId: data.threadId,
        username: data.username,
      },
    });
  }

  async find(data: Partial<Conversation>) {
    return this._conversation.model.conversation.findUnique({
      where: {
        threadId: data.threadId,
        username: data.username,
      },
    });
  }
}
