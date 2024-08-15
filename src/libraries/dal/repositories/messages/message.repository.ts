import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageRepository {
  constructor(private _message: PrismaRepository<'message'>) {}

  async create(data: any) {
    return this._message.model.message.create({
      data: {
        ...data,
      },
    });
  }
}
