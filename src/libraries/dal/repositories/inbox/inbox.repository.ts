import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';
import { Inbox } from '@prisma/client';

@Injectable()
export class InboxRepository {
  constructor(private _inbox: PrismaRepository<'inbox'>) {}

  async create(data: { username: string }) {
    return this._inbox.model.inbox.create({
      data: {
        username: data.username,
      },
    });
  }

  async findByUsername(data: Partial<Inbox>) {
    return this._inbox.model.inbox.findUnique({
      where: {
        username: data.username,
      },
    });
  }
}
