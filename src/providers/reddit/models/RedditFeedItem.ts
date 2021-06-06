import { FeedItem } from '../../../models/FeedItem';
import { RedditFeedSourceData } from './RedditFeedSourceData';

export interface RedditItem {
	data : {
		title : string;
		selftext : string;
		url : string;
		permalink : string;
		created_utc : number;
		author : string;
		preview? : {
			images? : {
				source: {
					url: string
				}
			}[];
		};
		gallery_data? : {
			items : {
				media_id : string
			}[];
		};
		media_metadata? : {
			[ id : string ] : {
				e : string;
				s : {
					u : string;
				}
			};
		};
	};
};

export class RedditFeedItem extends FeedItem<RedditFeedSourceData> {
	static fromRedditItem( source : RedditFeedSourceData, item : RedditItem ) : RedditFeedItem {
		const out = new RedditFeedItem( source );

		out.title = item.data.title;
		out.url = 'https://reddit.com' + item.data.permalink;
		out.timestamp = new Date( item.data.created_utc * 1000 );
		out.content = item.data.selftext.replace( /&#x200B;/g, '' ).trim();
		out.author = item.data.author;
		out.thumb = [
			...( item.data.preview?.images?.map( e => e.source.url ) ?? [] ),
			...(
				( item.data.gallery_data?.items ?? [] )
					.map( e => item.data.media_metadata![e.media_id].s.u )
			)
		];

		return out;
	}

	static fromRedditItems( source : RedditFeedSourceData, items : RedditItem[] ) : RedditFeedItem[] {
		return items.map( RedditFeedItem.fromRedditItem.bind( RedditFeedItem, source ) );
	}
};
