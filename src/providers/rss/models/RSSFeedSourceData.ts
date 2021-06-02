import { FeedSourceData } from '../../../models/FeedSourceData';

export interface RSSFeedSourceData extends FeedSourceData {
	provider : 'rss';
	url : string;
};
