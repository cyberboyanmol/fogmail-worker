import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { InjectInboundMailParseQueue } from 'src/libraries/queue/decorators/inject-queue.decorator';
import { QueueEventJobPattern } from 'src/libraries/queue/jobs/job.pattern';
import {
  MemberViewMailJob,
  VisitorViewMailJob,
} from 'src/libraries/queue/jobs/job.payload';
import { INBOUND_MAIL_PARSE_QUEUE } from 'src/libraries/queue/queue.constants';
import { simpleParser } from 'mailparser';
import { EmailInboxService } from '../services/email-inbox.service';
import { ConversationService } from '../services/conversation.service';
import { MessageService } from '../services/message.service';

@Processor(INBOUND_MAIL_PARSE_QUEUE, {
  concurrency: 50,
  useWorkerThreads: true,
})
@Injectable()
export class InboundMailProcessor extends WorkerHost {
  private readonly logger = new Logger(InboundMailProcessor.name);

  constructor(
    @InjectInboundMailParseQueue() private _inboundMailParseQueue: Queue,
    private _emailInboxService: EmailInboxService,
    private _conversationService: ConversationService,
    private _messageService: MessageService,
  ) {
    super();
  }

  async process(
    job: Job<VisitorViewMailJob['data'] | MemberViewMailJob['data']>,
  ): Promise<void> {
    try {
      switch (job.name) {
        case QueueEventJobPattern.MAIL_VISITOR_VIEW:
          // const parsedMail = await simpleParser(JSON.parse(job.data.rawMail));
          // console.log(parsedMail);
          await this.saveEmail(job);
          break;
        case QueueEventJobPattern.MAIL_MEMBER_VIEW:
          console.log(job.data);
        default:
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error; // Throwing the error will cause the job to be re-queued for retry
    }
  }

  async saveEmail(job: Job<VisitorViewMailJob['data']>) {
    const { rawMail, slug: username } = job.data;
    const rawEmail = JSON.parse(rawMail);
    const parsedEmail = await simpleParser(rawEmail);

    const [inbox, isThreadExist] = await Promise.all([
      this._emailInboxService.getEmailInbox({ username }),
      parsedEmail.references
        ? this._conversationService.findByThreadId({
            emailusername: username,
            threadId: Array.isArray(parsedEmail.references)
              ? parsedEmail.references[0]
              : parsedEmail.references,
          })
        : null,
    ]);

    if (!inbox) {
      await this._emailInboxService.createEmailInbox({ username });
    }

    let threadId: string;
    let newConversation;

    if (isThreadExist) {
      threadId = isThreadExist.threadId;
    } else {
      newConversation = await this._conversationService.createConversation({
        username,
        parsedEmail,
      });
      threadId = newConversation.threadId;
    }

    const message = await this._messageService.create({
      parsedEmail,
      rawEmail: rawMail,
      threadId,
    });

    this.logger.log('New message:', message);
    if (newConversation) {
      this.logger.log('New conversation:', newConversation);
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(
    job: Job<VisitorViewMailJob['data'] | MemberViewMailJob['data']>,
  ) {
    const { id, name, queueName, finishedOn } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';

    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}.`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
