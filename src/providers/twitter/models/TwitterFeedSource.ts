import { onlyonce } from '../../../util/onlyonce';
import { FeedItemPool, FeedSource } from '../../../models/FeedSource';
import { TwitterFeedItem, TwitterTweet } from './TwitterFeedItem';
import { TwitterTokenSource } from '../TwitterTokenSource';
import { TwitterFeedSourceData } from './TwitterFeedSourceData';

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

interface TwitterTimelineCursor {
	sortIndex : string;
	content : {
		entryType: 'TimelineTimelineCursor';
		value: string;
		cursorType: 'Top'|'Bottom';
	};
};

interface TwitterTimeline {
	data : {
		user : {
			result : {
				timeline : {
					timeline : {
						instructions : [{
							entries: (TwitterTweet|TwitterTimelineCursor)[]
						}]
					}
				}
			}
		}
	}
};

export class TwitterFeedSource extends FeedSource<TwitterFeedSourceData, string> {
	protected async queryTwitterApi( query : string, data : Record<string, string|number|boolean> ) {
		const tokenSource = TwitterTokenSource.getInstance();

		return this.request( `https://twitter.com/i/api/graphql/${ await tokenSource.getQueryId( query ) }/${ query }?` + new URLSearchParams( {
			variables: JSON.stringify( data )
		} ).toString(), {
			headers: {
				authorization: 'Bearer ' + ( await tokenSource.getAuthorizationToken() ),
				'x-guest-token': ( await tokenSource.getGuestToken() )
			}
		} );
	}

	@onlyonce
	public async fetchUserData() {
		return this.queryTwitterApi( 'UserByScreenNameWithoutResults', {
			screen_name: this.data.user.toLowerCase(),
			withHighlightedLabel: true
		} ).then<TwitterUserByScreenNameWithoutResults>( r => r.json() );
	}

	public async fetchPool( next? : string ) : Promise<FeedItemPool<TwitterFeedItem>> {
		const userData = await this.fetchUserData();

		const timelineQuery : Record<string, string|number|boolean> = {
			userId: userData.data.user.rest_id,
			count: 25,
			withHighlightedLabel: true,
			withTweetQuoteCount: true,
			includePromotedContent: true,
			withTweetResult: false,
			withReactions: false,
			withSuperFollowsTweetFields: false,
			withUserResults: false,
			withVoice: false,
			withNonLegacyCard: true,
			withBirdwatchPivots: false
		};

		if ( next ) {
			timelineQuery.cursor = next;
		}

		const timeline = await this.queryTwitterApi( 'UserTweets', timelineQuery )
			.then<TwitterTimeline>( r => r.json() );

		return {
			items: TwitterFeedItem.fromTweets(
				this.data,
				userData.data.user.legacy.screen_name,
				timeline.data.user.result.timeline.timeline.instructions[0].entries.filter(
					( e ) : e is TwitterTweet => e.content.entryType === 'TimelineTimelineItem'
				)
			),
			end: 0,
			next: timeline.data.user.result.timeline.timeline.instructions[0].entries.find(
				( e ) : e is TwitterTimelineCursor =>
					e.content.entryType === 'TimelineTimelineCursor'
					&& e.content.cursorType === 'Bottom'
			)?.content.value
		};
	}
};
