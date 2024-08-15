import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';
import { EmailInbox } from '@prisma/client';

@Injectable()
export class InboxRepository {
  constructor(private _inbox: PrismaRepository<'emailInbox'>) {}

  async create(data: { username: string }) {
    return this._inbox.model.emailInbox.create({
      data: {
        username: data.username,
      },
    });
  }

  async findByUsername(data: Partial<EmailInbox>) {
    return this._inbox.model.emailInbox.findUnique({
      where: {
        username: data.username,
      },
    });
  }
}
