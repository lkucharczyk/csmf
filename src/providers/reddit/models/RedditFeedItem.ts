import { FeedItem } from '../../../models/FeedItem';
import { RedditFeedSourceData } from './RedditFeedSourceData';

export interface RedditItem {
	data : {
		title : string;
		selftext : string;
		url : string;
		permalink : string;
		created_utc : number;
	};
};

export class RedditFeedItem extends FeedItem<RedditFeedSourceData> {
	static fromRedditItem( source : RedditFeedSourceData, item : RedditItem ) : RedditFeedItem {
		const out = new RedditFeedItem( source );

		out.title = item.data.title;
		out.url = 'https://reddit.com' + item.data.permalink;
		out.timestamp = new Date( item.data.created_utc * 1000 );
		out.content = item.data.selftext;

		return out;
	}

	static fromRedditItems( source : RedditFeedSourceData, items : RedditItem[] ) : RedditFeedItem[] {
		return items.map( RedditFeedItem.fromRedditItem.bind( RedditFeedItem, source ) );
	}
};
