import { FeedSourceData } from './FeedSourceData';
import { ProviderData } from '../../types/providerdata';

export class FeedItem<T extends FeedSourceData = ProviderData> {
	public title? : string;
	public content? : string;
	public timestamp? : Date;
	public url? : string;
	public thumb? : string[];

	public constructor( public readonly source : T ) {};
};
