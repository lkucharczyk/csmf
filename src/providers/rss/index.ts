import { RSSFeedItem } from './models/RSSFeedItem';
import { RSSFeedSource } from './models/RSSFeedSource';

export { RSSFeedItem } from './models/RSSFeedItem';
export { RSSFeedSource } from './models/RSSFeedSource';
export const PROVIDER_DEFINTION = {
	id: 'rss',
	feedItem: RSSFeedItem,
	feedSource: RSSFeedSource
};
