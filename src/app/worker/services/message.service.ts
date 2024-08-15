import { Injectable } from '@nestjs/common';
import { Attachment, HeaderLines, ParsedMail } from 'mailparser';

import { MessageRepository } from 'src/libraries/dal/repositories/messages/message.repository';

@Injectable()
export class MessageService {
  constructor(private _messageRepository: MessageRepository) {}

  public async create(data: {
    parsedEmail: ParsedMail;
    rawEmail: string;
    threadId: string;
  }) {
    const references = Array.isArray(data.parsedEmail.references)
      ? data.parsedEmail.references
      : data.parsedEmail.references
        ? [data.parsedEmail.references]
        : [];

    const toAddresses = this.normalizeAddresses(data.parsedEmail.to);
    const ccAddresses = this.normalizeAddresses(data.parsedEmail.cc);
    const bccAddresses = this.normalizeAddresses(data.parsedEmail.bcc);
    const fromAddress = this.normalizeAddresses(data.parsedEmail.from)[0];
    const headers = this.normalizeHeaders(data.parsedEmail.headerLines);
    const attachments = this.normalizeAttachments(data.parsedEmail.attachments);

    return this._messageRepository.create({
      messageId: data.parsedEmail.messageId,
      conversation: {
        connect: { threadId: data.threadId },
      },
      subject: data.parsedEmail.subject,
      rawMail: data.rawEmail,
      size: data.rawEmail.length * 2,
      headers: this.headersToJson(data.parsedEmail.headers),
      text: data.parsedEmail.text,
      textAsHtml: data.parsedEmail.textAsHtml,
      html: data.parsedEmail.html,
      inReplyTo: data.parsedEmail.inReplyTo,
      references: references,
      date: data.parsedEmail.date,
      status: 'UNREAD',
      fromAddress: {
        connectOrCreate: {
          where: { address: fromAddress.address },
          create: { name: fromAddress.name, address: fromAddress.address },
        },
      },
      toList: {
        connectOrCreate: toAddresses.map((addr) => ({
          where: { address: addr.address },
          create: { name: addr.name, address: addr.address },
        })),
      },
      ccList: {
        connectOrCreate: ccAddresses.map((addr) => ({
          where: { address: addr.address },
          create: { name: addr.name, address: addr.address },
        })),
      },
      bccList: {
        connectOrCreate: bccAddresses.map((addr) => ({
          where: { address: addr.address },
          create: { name: addr.name, address: addr.address },
        })),
      },
      headerLines: {
        create: headers,
      },
      attachments: {
        create: attachments,
      },
    });
  }

  private normalizeAddresses(
    addresses: any,
  ): { name: string; address: string }[] {
    if (!addresses) return [];
    if (Array.isArray(addresses)) {
      return addresses.flatMap((addr) =>
        addr.value.map((v) => ({ name: v.name, address: v.address })),
      );
    }
    return addresses.value.map((v) => ({ name: v.name, address: v.address }));
  }

  private normalizeHeaders(
    headerLines: HeaderLines,
  ): { key: string; value: string }[] {
    return headerLines.map((header) => ({
      key: header.key,
      value: header.line,
    }));
  }

  private normalizeAttachments(attachments: Attachment[] | undefined): any[] {
    if (!attachments) return [];
    return attachments.map((attachment) => ({
      contentType: attachment.contentType,
      contentDisposition: attachment.contentDisposition,
      fileName: attachment.filename,
      cid: attachment.cid || '',
      checksum: attachment.checksum || '',
      size: attachment.size,
    }));
  }
  private headersToJson(headers: any): Record<string, string | string[]> {
    const result: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (Array.isArray(value)) {
        result[key] = value.map((v) => v.toString());
      } else if (value !== null && value !== undefined) {
        result[key] = value.toString();
      }
    }
    return result;
  }
}
