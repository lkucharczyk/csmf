import { FetchLike } from '../../types/fetchlike';
import { FeedItem } from './FeedItem';
import { FeedSourceData } from './FeedSourceData';

export interface FeedItemPool<Item extends FeedItem = FeedItem, Next = any> {
	items : Item[],
	end : number,
	next : Next|null
};

export abstract class FeedSource<T extends FeedSourceData, FetchNext = any> {
	public constructor( public data : T, protected request : FetchLike ) {}

	protected abstract fetchPool( next? : FetchNext ) : Promise<FeedItemPool>;

	public async *fetch() : AsyncGenerator<FeedItem> {
		let pool : FeedItemPool = await this.fetchPool();

		while ( pool.items.length > 0 ) {
			while ( pool.items.length > 0 ) {
				yield pool.items.shift()!;
			}

			if ( pool.next !== null ) {
				pool = await this.fetchPool( pool.next );
			}
		}
	}
};
