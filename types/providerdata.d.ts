import { RedditFeedSourceData } from '../src/providers/reddit/models/RedditFeedSourceData';
import { RSSFeedSourceData } from '../src/providers/rss/models/RSSFeedSourceData';
import { TwitterFeedSourceData } from '../src/providers/twitter/models/TwitterFeedSourceData';

type ProviderData = RedditFeedSourceData|RSSFeedSourceData|TwitterFeedSourceData;
