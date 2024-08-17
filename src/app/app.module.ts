import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/libraries/dal/prisma/database.module';
import { HealthCheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    WorkerModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
