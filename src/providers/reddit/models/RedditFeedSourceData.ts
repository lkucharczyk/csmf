import { FeedSourceData } from '../../../models/FeedSourceData';

export interface RedditFeedSourceData extends FeedSourceData {
	provider : 'reddit';
	sub : string;
};
