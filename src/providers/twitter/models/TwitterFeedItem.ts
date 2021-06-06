import { FeedItem } from '../../../models/FeedItem';
import { TwitterFeedSourceData } from './TwitterFeedSourceData';

interface TwitterTweetData {
	created_at : string;
	full_text : string;
	entities : {
		media? : {
			media_url_https : string;
		}[]
	};
	retweeted_status? : {
		legacy : TwitterTweetData;
	};
}

export interface TwitterTweet {
	sortIndex : string;
	content : {
		entryType: 'TimelineTimelineItem',
		itemContent : {
			tweet : {
				legacy : TwitterTweetData
			}
		}
	};
};

export class TwitterFeedItem extends FeedItem<TwitterFeedSourceData> {
	static fromTweet( source : TwitterFeedSourceData, user : string, item : TwitterTweet ) : TwitterFeedItem {
		const out = new TwitterFeedItem( source );

		const data = item.content.itemContent.tweet.legacy;

		out.title = 'Tweet from @' + user;
		out.url = `https://twitter.com/${ user }/status/${ item.sortIndex }`;
		out.timestamp = new Date( data.created_at );
		out.content = data.full_text;
		out.author = user;
		out.thumb = data.entities.media?.map( e => e.media_url_https );
		if ( ( !out.thumb || out.thumb.length === 0 ) && data.retweeted_status ) {
			out.thumb = data.retweeted_status.legacy.entities.media?.map( e => e.media_url_https );
		}

		return out;
	}

	static fromTweets( source : TwitterFeedSourceData, user : string, items : TwitterTweet[] ) : TwitterFeedItem[] {
		return items.map( TwitterFeedItem.fromTweet.bind( TwitterFeedItem, source, user ) );
	}
};
