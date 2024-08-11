import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
