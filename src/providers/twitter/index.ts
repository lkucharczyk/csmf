import { TwitterFeedItem } from './models/TwitterFeedItem';
import { TwitterFeedSource } from './models/TwitterFeedSource';

export { TwitterFeedItem } from './models/TwitterFeedItem';
export { TwitterFeedSource } from './models/TwitterFeedSource';
export const PROVIDER_DEFINTION = {
	id: 'twitter',
	feedItem: TwitterFeedItem,
	feedSource: TwitterFeedSource
};
