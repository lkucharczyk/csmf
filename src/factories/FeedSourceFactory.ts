import { ProviderData } from '../../types/providerdata';
import container from '../container';
import { FeedSource } from '../models/FeedSource';
import { RedditFeedSource } from '../providers/reddit';
import { RSSFeedSource } from '../providers/rss';
import { TwitterFeedSource } from '../providers/twitter';

export class FeedSourceFactory {
	private static instance? : FeedSourceFactory;

	public static getInstance() {
		if ( !FeedSourceFactory.instance ) {
			FeedSourceFactory.instance = new FeedSourceFactory();
		}

		return FeedSourceFactory.instance;
	}

	public getFeedSource( data : ProviderData ) : FeedSource<typeof data> {
		switch ( data.provider ) {
			case 'reddit': return new RedditFeedSource( data, container.fetch );
			case 'rss': return new RSSFeedSource( data, container.fetch );
			case 'twitter': return new TwitterFeedSource( data, container.fetch );

			// @ts-ignore
			default: throw new Error( 'Unrecognized feed provider: ' + data.provider );
		}
	}

	public getFeedSources( sources : ProviderData[] ) : FeedSource<ProviderData>[] {
		return sources.map( e => this.getFeedSource( e ) );
	}
}
