import { FeedItem } from '../../../models/FeedItem';
import { TwitterFeedSourceData } from './TwitterFeedSourceData';

export interface TwitterTweet {
	sortIndex : string;
	content : {
		entryType: 'TimelineTimelineItem',
		itemContent : {
			tweet : {
				legacy : {
					created_at : string;
					full_text : string;
				}
			}
		}
	}
};

export class TwitterFeedItem extends FeedItem<TwitterFeedSourceData> {
	static fromTweet( source : TwitterFeedSourceData, user : string, item : TwitterTweet ) : TwitterFeedItem {
		const out = new TwitterFeedItem( source );

		out.title = 'Tweet from @' + user;
		out.url = `https://twitter.com/${ user }/status/${ item.sortIndex }`;
		out.timestamp = new Date( item.content.itemContent.tweet.legacy.created_at );
		out.content = item.content.itemContent.tweet.legacy.full_text;

		return out;
	}

	static fromTweets( source : TwitterFeedSourceData, user : string, items : TwitterTweet[] ) : TwitterFeedItem[] {
		return items.map( TwitterFeedItem.fromTweet.bind( TwitterFeedItem, source, user ) );
	}
};
