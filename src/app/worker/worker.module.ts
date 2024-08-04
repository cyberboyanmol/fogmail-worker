import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INBOUND_MAIL_PARSE_QUEUE } from 'src/libraries/queue/queue.constants';
import { QueueModule } from 'src/libraries/queue/queue.module';
import { InboundMailProcessor } from './processors/inbound-mail.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS,
      },
      defaultJobOptions: {
        removeOnComplete: true, // Remove job from the queue once it's completed
        attempts: 3, // Number of attempts before a job is marked as failed
        removeOnFail: {
          age: 200,
          count: 10,
        },
        backoff: {
          // Optional backoff settings for retrying failed jobs
          type: 'exponential',
          delay: 60000, // Initial delay of 60 second
        },
      },
    }),
    QueueModule.register({
      queues: [INBOUND_MAIL_PARSE_QUEUE],
    }),
  ],
  providers: [InboundMailProcessor],
  exports: [],
})
export class WorkerModule {}
