import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RateLimiterModule } from 'nestjs-rate-limiter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterRedisUseGuard } from './RateLimiterRedis';

@Module({
  imports: [RateLimiterModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimiterRedisUseGuard,
    },
  ],
})
export class AppModule {}
