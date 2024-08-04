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
@Processor(INBOUND_MAIL_PARSE_QUEUE, {
  concurrency: 50,
  useWorkerThreads: true,
})
@Injectable()
export class InboundMailProcessor extends WorkerHost {
  private readonly logger = new Logger(InboundMailProcessor.name);

  constructor(
    @InjectInboundMailParseQueue() private _inboundMailParseQueue: Queue,
  ) {
    super();
  }

  async process(
    job: Job<VisitorViewMailJob['data'] | MemberViewMailJob['data']>,
  ): Promise<void> {
    try {
      switch (job.name) {
        // for visitor views
        case QueueEventJobPattern.MAIL_VISITOR_VIEW:
          console.log(job.data);
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
