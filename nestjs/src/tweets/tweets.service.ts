import { Tweet, TweetDocument } from './schemas/tweet.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Root } from 'src/mail-list/dto/tweets';
import fetch from 'node-fetch';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet.name)
    private tweetModel: Model<TweetDocument>,
  ) {}

  create(createTweetDto: CreateTweetDto) {
    return this.tweetModel.create(createTweetDto);
  }

  findAll(
    { offset, limit }: { offset: number; limit: number } = {
      offset: 0,
      limit: 100,
    },
  ) {
    return this.tweetModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort({ CreatedAt: -1 })
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }

  async makeHttpRequest(): Promise<Root> {
    const token = process.env.BEARER_TOKEN;

    const endpointUrl = new URL(
      'https://api.twitter.com/2/tweets/search/recent',
    );

    const query = 'bbb OR #bbb OR #BBB23';

    const params = {
      query: query, // Required
      max_results: String(10),
      // "start_time": "2020-07-01T00:00:00Z",
      // "end_time": "2020-07-02T18:00:00Z",
      // "expansions": "attachments.poll_ids,attachments.media_keys,author_id",
      expansions: 'author_id',
      'tweet.fields':
        'attachments,author_id,conversation_id,created_at,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld',
      'user.fields':
        'created_at,entities,description,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,verified_type,withheld',
      'media.fields': 'preview_image_url,url',
      'place.fields': 'contained_within,country,full_name,geo,name,place_type',
      // "poll.fields": "options"
    };

    endpointUrl.search = new URLSearchParams(params).toString();
    let data: Root;
    try {
      const res = await fetch(endpointUrl, {
        headers: {
          'User-Agent': 'v2RecentSearchJS',
          authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      data = res;
    } catch (error) {
      console.log('um erro ocorreu ao fazer uma chamada no twitter:', error);
    }

    return data;
  }
}
