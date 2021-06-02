import { FeedItem } from '../../../models/FeedItem';
import { RSSFeedSourceData } from './RSSFeedSourceData';

export interface RSSItem {
	title : string;
	link : string;
	comments : string;
	pubDate : string;
	category : string|string[];
	guid : string;
	description : string;
};

export class RSSFeedItem extends FeedItem<RSSFeedSourceData> {
	static fromRSSItem( source : RSSFeedSourceData, item : RSSItem ) : RSSFeedItem {
		const out = new RSSFeedItem( source );

		out.title = item.title;
		out.url = item.link;
		out.timestamp = new Date( item.pubDate );
		out.content = item.description;

		return out;
	}

	static fromRSSItems( source : RSSFeedSourceData, items : RSSItem[] ) : RSSFeedItem[] {
		return items.map( RSSFeedItem.fromRSSItem.bind( RSSFeedItem, source ) );
	}
};
