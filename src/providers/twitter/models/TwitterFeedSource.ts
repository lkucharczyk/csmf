import { FeedItemPool, FeedSource } from '../../../models/FeedSource';
import { TwitterFeedItem, TwitterTweet } from './TwitterFeedItem';
import { TwitterTokenSource } from '../TwitterTokenSource';
import { TwitterFeedSourceData } from './TwitterFeedSourceData';

const fetch = window?.fetch ?? require( 'node-fetch' );

interface TwitterUserByScreenNameWithoutResults {
	data : {
		user : {
			rest_id : string
			legacy : {
				screen_name : string
			}
		}
	}
};

interface TwitterTimeline {
	data : {
		user : {
			result : {
				timeline : {
					timeline : {
						instructions : [{
							entries: TwitterTweet[]
						}]
					}
				}
			}
		}
	}
};

export class TwitterFeedSource extends FeedSource<TwitterFeedSourceData, never> {
	public async fetchPool() : Promise<FeedItemPool<TwitterFeedItem>> {
		const tokens = await TwitterTokenSource.getInstance().getTokens();

		const name : TwitterUserByScreenNameWithoutResults = await fetch( 'https://twitter.com/i/api/graphql/Vf8si2dfZ1zmah8ePYPjDQ/UserByScreenNameWithoutResults?' + new URLSearchParams( {
			variables: JSON.stringify( {
				screen_name: this.data.user.toLowerCase(),
				withHighlightedLabel: true
			} )
		} ).toString(), {
			headers: {
				authorization: 'Bearer ' + tokens.authToken,
				'x-guest-token': tokens.guestToken
			}
		} ).then( r => r.json() );

		const timeline : TwitterTimeline = await fetch( `https://twitter.com/i/api/graphql/1DL8zlYnR-WKbi0BUG2rzQ/UserTweets?` + new URLSearchParams( {
			variables: JSON.stringify( {
				userId: name.data.user.rest_id,
				count: 20,
				withHighlightedLabel: true,
				withTweetQuoteCount: true,
				includePromotedContent: true,
				withTweetResult: false,
				withReactions: false,
				withUserResults: false,
				withVoice: false,
				withNonLegacyCard: true,
				withBirdwatchPivots: false
			} ),
		} ).toString(), {
			headers: {
				authorization: 'Bearer ' + tokens.authToken,
				'x-guest-token': tokens.guestToken
			}
		} ).then( r => r.json() );

		return {
			items: TwitterFeedItem.fromTweets(
				this.data,
				name.data.user.legacy.screen_name,
				timeline.data.user.result.timeline.timeline.instructions[0].entries.filter( e =>
					e.content.entryType === 'TimelineTimelineItem'
				)
			),
			end: 0,
			next: null
		};
	}
};
