import { FeedItemPool, FeedSource } from '../../../models/FeedSource';
import { RedditFeedItem, RedditItem } from './RedditFeedItem';
import { RedditFeedSourceData } from './RedditFeedSourceData';

interface RedditNewPosts {
	data : {
		children : RedditItem[]
		after : string
	}
};

export class RedditFeedSource extends FeedSource<RedditFeedSourceData, string> {
	public async fetchPool( next? : string ) : Promise<FeedItemPool<RedditFeedItem>> {
		const raw = await this.request(
			`https://www.reddit.com/r/${ encodeURIComponent( this.data.sub ) }/new.json?raw_json=1`
			+ ( next ? `&after=${ next }` : '' )
		).then( r => r.json<RedditNewPosts>() );

		return {
			items: RedditFeedItem.fromRedditItems( this.data, raw.data.children ),
			end: raw.data.children[raw.data.children.length - 1].data.created_utc * 1000,
			next: raw.data.after
		};
	}
};
