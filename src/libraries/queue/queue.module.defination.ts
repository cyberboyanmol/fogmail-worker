import { QueueBoardModuleOptions } from 'src/libraries/interfaces/queue.interface';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<QueueBoardModuleOptions>().build();
