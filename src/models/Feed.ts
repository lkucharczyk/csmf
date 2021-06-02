import { ProviderData } from '../../types/providerdata';
import { FeedItem } from './FeedItem';
import { FeedSource } from './FeedSource';

export class Feed {
	public constructor( public sources : FeedSource<ProviderData>[] ) {

	}

	public async *fetch() : AsyncGenerator<FeedItem> {
		const now = Date.now();

		let i = 0;
		const generators = this.sources.map( s => [ i++, s.fetch() ] as const );
		const queue = await Promise.all( generators.map( ( [ i, g ] ) => g.next() ) );

		while ( queue.find( r => r.value !== undefined ) ) {
			const item = queue.map<[ number, FeedItem ]>( ( r, i ) => [ i, r.value ] )
				.filter( r => r[1] !== undefined )
				.sort( ( a, b ) => ( b[1].timestamp?.getTime() ?? now ) - ( a[1].timestamp?.getTime() ?? now ) )
				.shift()!;

			yield item[1];
			queue[item[0]] = await generators[item[0]][1].next();
		}
	}
};
