import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './queue.module.defination';
import { BullModule } from '@nestjs/bullmq';

@Module({})
export class QueueModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const bullModules = options.queues.map((name) =>
      BullModule.registerQueue({ name }),
    );
    return {
      ...super.register(options),
      imports: [...bullModules],
      exports: [...bullModules],
    };
  }
}
