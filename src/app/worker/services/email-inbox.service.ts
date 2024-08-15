import { Injectable } from '@nestjs/common';
import { InboxRepository } from 'src/libraries/dal/repositories/inbox/inbox.repository';

@Injectable()
export class EmailInboxService {
  constructor(private _inboxRepository: InboxRepository) {}
  public async getEmailInbox(data: { username: string }) {
    return await this._inboxRepository.findByUsername({
      username: data.username,
    });
  }

  public async createEmailInbox(data: { username: string }) {
    return await this._inboxRepository.create({ username: data.username });
  }
}
