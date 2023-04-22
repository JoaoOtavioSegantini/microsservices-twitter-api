import { TweetsService } from '../tweets.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class SendNewTweetsTask {
  constructor(
    private tweetService: TweetsService,
    @InjectQueue('tweets')
    private tweetsQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handle() {
    console.log('mandando tweets...');

    const tweets = await this.tweetService.makeHttpRequest();

    this.tweetsQueue.add(tweets); //kafka
  }
}

