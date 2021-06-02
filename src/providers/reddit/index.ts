import { RedditFeedItem } from './models/RedditFeedItem';
import { RedditFeedSource } from './models/RedditFeedSource';

export { RedditFeedItem } from './models/RedditFeedItem';
export { RedditFeedSource } from './models/RedditFeedSource';
export {}
export const PROVIDER_DEFINTION = {
	id: 'reddit',
	feedItem: RedditFeedItem,
	feedSource: RedditFeedSource
};
