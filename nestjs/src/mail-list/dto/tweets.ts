export interface Root {
    data: Data[]
    includes: Includes
    meta: Meta
  }
  
  export interface Data {
    text: string
    edit_history_tweet_ids: string[]
    possibly_sensitive: boolean
    author_id: string
    referenced_tweets?: ReferencedTweet[]
    public_metrics: PublicMetrics
    lang: string
    conversation_id: string
    created_at: string
    reply_settings: string
    id: string
    in_reply_to_user_id?: string
    attachments?: Attachments
  }
  
  export interface ReferencedTweet {
    type: string
    id: string
  }
  
  export interface PublicMetrics {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
    impression_count: number
  }
  
  export interface Attachments {
    media_keys: string[]
  }
  
  export interface Includes {
    users: User[]
  }
  
  export interface User {
    description: string
    created_at: string
    name: string
    verified_type: string
    profile_image_url: string
    protected: boolean
    verified: boolean
    public_metrics: PublicMetrics2
    id: string
    username: string
    pinned_tweet_id?: string
    entities?: Entities
    url?: string
    location?: string
  }
  
  export interface PublicMetrics2 {
    followers_count: number
    following_count: number
    tweet_count: number
    listed_count: number
  }
  
  export interface Entities {
    url: Url
  }
  
  export interface Url {
    urls: Url2[]
  }
  
  export interface Url2 {
    start: number
    end: number
    url: string
    expanded_url: string
    display_url: string
  }
  
  export interface Meta {
    newest_id: string
    oldest_id: string
    result_count: number
    next_token: string
  }
  