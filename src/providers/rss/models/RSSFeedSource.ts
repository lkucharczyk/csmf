import { FeedItemPool, FeedSource } from '../../../models/FeedSource';
import { RSSFeedItem, RSSItem } from './RSSFeedItem';
import { RSSFeedSourceData } from './RSSFeedSourceData';
import XMLParser from 'fast-xml-parser';

const fetch = window?.fetch ?? require( 'node-fetch' );

interface RSS {
	rss : {
		channel : {
			title : string;
			link : string;
			description : string;
			lastBuildDate : string;
			language : string;
			item : RSSItem[]
		}
	}
};

export class RSSFeedSource extends FeedSource<RSSFeedSourceData, never> {
	public async fetchPool() : Promise<FeedItemPool<RSSFeedItem>> {
		const raw = await fetch( this.data!.url! ).then( r => r.text() );
		const rss : RSS = XMLParser.parse( raw );

		return {
			items: RSSFeedItem.fromRSSItems( this.data, rss.rss.channel.item ),
			end: 0,
			next: null
		};
	}
};
