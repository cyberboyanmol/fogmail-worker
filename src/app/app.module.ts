import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/libraries/dal/prisma/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    WorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
