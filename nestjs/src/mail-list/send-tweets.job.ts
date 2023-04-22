import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { Inject } from '@nestjs/common';
import { Root } from './dto/tweets';

@Processor('tweets')
export class SendTweetsJob {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
  ) {}

  @Process()
  async handle(job: Job<Root>) {
    job.data.data.forEach(async (res) =>
      job.data.includes.users.forEach(
        async (user) =>
          await this.kafkaProducer.send({
            topic: 'tweets',
            messages: [
              {
                key: 'tweets',
                value: JSON.stringify({
                  Text: res.text,
                  InReplyToStatusId: res?.in_reply_to_user_id,
                  GeoLocation: user?.location,
                  FavoriteCount: res.public_metrics.like_count,
                  RetweetCount: res.public_metrics.retweet_count,
                  CurrentUserRetweetId: res?.referenced_tweets[0]?.id || '1',
                  PossiblySensitive: res.possibly_sensitive,
                  Lang: res.lang,
                  User: {
                    Id: user.id,
                    Name: user.name,
                    ScreenName: user.username,
                    Location: user?.location,
                    Description: user.description,
                    ProfileImageURL: user.profile_image_url,
                    MiniProfileImageURL: user?.entities?.url || '',
                    URL: user?.url || '',
                    Protected: user.protected,
                    FollowersCount: user.public_metrics.followers_count,
                    FriendsCount: user.public_metrics.following_count,
                    CreatedAt: user.created_at,
                    Verified: user.verified,
                    ListedCount: user.public_metrics.listed_count,
                    ProfileImageURLHttps:
                      user?.entities?.url?.urls[0]?.display_url || '',

                    OriginalProfileImageURL:
                      user?.entities?.url?.urls[0]?.url || '',

                    BiggerProfileImageURL:
                      user?.entities?.url?.urls[0]?.expanded_url || '',
                  },
                  CreatedAt: res.created_at,
                }),
              },
            ],
          }),
      ),
    );
  }
}

//nest       Kafka        golang
