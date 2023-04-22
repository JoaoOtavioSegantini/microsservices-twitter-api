import { Tweet, TweetSchema } from './schemas/tweet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { CheckNewTweetsTask } from './check-new-tweets/check-new-tweets.task';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { SendNewTweetsTask } from './send-new-tweets/send-new-tweets.task';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        auth_pass: process.env.REDIS_PASSWORD
      }),
    }),
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    BullModule.registerQueue({
      name: 'emails',
    }),
    BullModule.registerQueue({
      name: 'tweets',
    }),
  ],
  controllers: [TweetsController],
  providers: [TweetsService, CheckNewTweetsTask, SendNewTweetsTask],
})
export class TweetsModule {}
