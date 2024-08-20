import { Injectable } from '@nestjs/common';
import { Attachment, HeaderLines, ParsedMail } from 'mailparser';

import { MessageRepository } from 'src/libraries/dal/repositories/messages/message.repository';

@Injectable()
export class MessageService {
  constructor(private _messageRepository: MessageRepository) {}

  public async create(data: {
    parsedEmail: ParsedMail;
    rawEmail: string;
    conversationId: string;
  }) {
    const toAddresses = this.normalizeAddresses(data.parsedEmail.to);
    const ccAddresses = this.normalizeAddresses(data.parsedEmail.cc);
    const bccAddresses = this.normalizeAddresses(data.parsedEmail.bcc);
    const fromAddress = this.normalizeAddresses(data.parsedEmail.from)[0];
    const headers = this.normalizeHeaders(data.parsedEmail.headerLines);
    const attachments = this.normalizeAttachments(data.parsedEmail.attachments);
    const headersObject = Object.fromEntries(data.parsedEmail.headers);
    const references = Array.isArray(data.parsedEmail.references)
      ? data.parsedEmail.references
      : data.parsedEmail.references
        ? [data.parsedEmail.references]
        : [];

    const encoder = new TextEncoder();
    const encoded = encoder.encode(data.rawEmail);
    return this._messageRepository.create({
      messageId: data.parsedEmail.messageId,
      conversation: {
        connect: { id: data.conversationId },
      },
      subject: data.parsedEmail.subject,
      rawMail: data.rawEmail,
      size: encoded.length,
      headers: JSON.stringify(headersObject, null, 2),
      text: JSON.stringify(data.parsedEmail.text),
      textAsHtml: JSON.stringify(data.parsedEmail.textAsHtml),
      html: JSON.stringify(data.parsedEmail.html),
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
}
