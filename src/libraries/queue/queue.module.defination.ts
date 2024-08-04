import { QueueBoardModuleOptions } from 'src/app/interfaces/queue.interface';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<QueueBoardModuleOptions>().build();
