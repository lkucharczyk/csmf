import { FeedItemPool, FeedSource } from '../../../models/FeedSource';
import { RedditFeedItem, RedditItem } from './RedditFeedItem';
import { RedditFeedSourceData } from './RedditFeedSourceData';

const fetch = window?.fetch ?? require( 'node-fetch' );

interface RedditNewPosts {
	data : {
		children : RedditItem[]
		after : string
	}
};

export class RedditFeedSource extends FeedSource<RedditFeedSourceData, string> {
	public async fetchPool( next? : string ) : Promise<FeedItemPool<RedditFeedItem>> {
		const raw = await fetch(
			`https://www.reddit.com/r/${ encodeURIComponent( this.data.sub ) }/new.json`
			+ ( next ? `?after=${ next }` : '' )
		).then<RedditNewPosts>( r => r.json() );

		return {
			items: RedditFeedItem.fromRedditItems( this.data, raw.data.children ),
			end: raw.data.children[raw.data.children.length - 1].data.created_utc * 1000,
			next: raw.data.after
		};
	}
};
