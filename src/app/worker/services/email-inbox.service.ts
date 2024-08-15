import { Injectable } from '@nestjs/common';
import { InboxRepository } from 'src/libraries/dal/repositories/inbox/inbox.repository';

@Injectable()
export class EmailInboxService {
  constructor(private _inboxRepository: InboxRepository) {}
  public async getEmailInbox(data: { username: string }) {
    const isInboxExits = await this._inboxRepository.findByUsername({
      username: data.username,
    });
    if (isInboxExits) {
      return isInboxExits;
    }
    return await this.createEmailInbox(data);
  }

  private async createEmailInbox(data: { username: string }) {
    return await this._inboxRepository.create({ username: data.username });
  }
}
