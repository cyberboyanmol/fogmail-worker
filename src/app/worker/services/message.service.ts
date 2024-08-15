import { Injectable } from '@nestjs/common';
import { ParsedMail } from 'mailparser';

import { MessageRepository } from 'src/libraries/dal/repositories/messages/message.repository';

@Injectable()
export class MessageService {
  constructor(private _messageRepository: MessageRepository) {}
  public async create(data: {
    parsedEmail: ParsedMail;
    rawEmail: string;
    threadId: string;
  }) {
    const toAddresses = Array.isArray(data.parsedEmail.to)
      ? data.parsedEmail.to
      : data.parsedEmail.to
        ? [data.parsedEmail.to]
        : [];

    const ccAddresses = Array.isArray(data.parsedEmail.cc)
      ? data.parsedEmail.cc
      : data.parsedEmail.cc
        ? [data.parsedEmail.cc]
        : [];

    const bccAddresses = Array.isArray(data.parsedEmail.bcc)
      ? data.parsedEmail.bcc
      : data.parsedEmail.bcc
        ? [data.parsedEmail.bcc]
        : [];

    const references = Array.isArray(data.parsedEmail.references)
      ? data.parsedEmail.references
      : data.parsedEmail.references
        ? [data.parsedEmail.references]
        : [];

    return this._messageRepository.create({
      messageId: data.parsedEmail.messageId,
      conversation: {
        connect: { threadId: data.threadId },
      },
      subject: data.parsedEmail.subject,
      rawMail: data.rawEmail,
      size: data.rawEmail.length * 2,
      headers: data.parsedEmail.headers,
      text: data.parsedEmail.text,
      textAsHtml: data.parsedEmail.textAsHtml,
      html: data.parsedEmail.html,
      inReplyTo: data.parsedEmail.inReplyTo,
      references: references,
      date: data.parsedEmail.date,
      status: 'UNREAD',
      // fromAddress: {
      //   connectOrCreate: data.parsedEmail.from.value.map((_sender) => {
      //     return {
      //       where: {
      //         address: _sender.address,
      //       },
      //       create: {
      //         name: _sender.name,
      //         address: _sender.address,
      //       },
      //     };
      //   }),
      // },
      // toList: {
      //   connectOrCreate: toAddresses.flatMap((address) => {
      //     return address.value.map((_sender) => ({
      //       where: {
      //         address: _sender.address,
      //       },
      //       create: {
      //         name: _sender.name,
      //         address: _sender.address,
      //       },
      //     }));
      //   }),
      // },
      // ccList: {
      //   connectOrCreate: ccAddresses.flatMap((address) => {
      //     return address.value.map((_sender) => ({
      //       where: {
      //         address: _sender.address,
      //       },
      //       create: {
      //         name: _sender.name,
      //         address: _sender.address,
      //       },
      //     }));
      //   }),
      // },
      // bccList: {
      //   connectOrCreate: bccAddresses.flatMap((address) => {
      //     return address.value.map((_sender) => ({
      //       where: {
      //         address: _sender.address,
      //       },
      //       create: {
      //         name: _sender.name,
      //         address: _sender.address,
      //       },
      //     }));
      //   }),
      // },
    });
  }
}
