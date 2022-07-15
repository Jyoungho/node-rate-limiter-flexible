import { IRateLimiterMongoOptions, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { RateLimiterGuard } from 'nestjs-rate-limiter';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const redisClient = new Redis({ enableOfflineQueue: false });
redisClient.on('error', (err) => {
  return null;
});

console.log(redisClient);

const opts: IRateLimiterMongoOptions = {
  storeClient: redisClient,
  points: 3,
  duration: 5,

  execEvenly: false, // Do not delay actions evenly
  blockDuration: 0, // Do not block if consumed more than points
  keyPrefix: 'rlflx', // must be unique for limiters with different purpose
};

const rateLimiterRedis = new RateLimiterRedis(opts);

export class RateLimiterRedisUseGuard extends RateLimiterGuard {
  canActivate(context: ExecutionContext): Promise<boolean> {
    return rateLimiterRedis
      .consume('ss')
      .then((rateLimiterRes) => {
        // ... Some app logic here ...
        return true;
      })
      .catch((rejRes) => {
        if (rejRes instanceof Error) {
          // Some Redis error
          // Never happen if `insuranceLimiter` set up
          // Decide what to do with it in other case
        } else {
          // Can't consume
          // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
        }
        // throw new customException() when you want to occur custom exception
        return false;
      });
  }
}
