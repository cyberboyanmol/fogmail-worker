import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthcheck() {
    return 'FOGMAIL WORKER SERVICE IS HEALTHY ✅ 🚀.';
  }
}
