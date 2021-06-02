import { FeedSourceData } from '../../../models/FeedSourceData';

export interface TwitterFeedSourceData extends FeedSourceData {
	provider : 'twitter';
	user : string;
};
