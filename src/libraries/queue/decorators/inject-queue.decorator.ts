import { InjectQueue } from '@nestjs/bullmq';
import { INBOUND_MAIL_PARSE_QUEUE } from '../queue.constants';

export const InjectInboundMailParseQueue = () =>
  InjectQueue(INBOUND_MAIL_PARSE_QUEUE);
