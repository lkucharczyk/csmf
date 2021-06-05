const fetch = window?.fetch ?? require( 'node-fetch' );

export class TwitterTokenSource {
	public static readonly REGEXP_MAINJS = /<script type="text\/javascript" charset="utf-8" nonce="[^"]+" crossorigin="anonymous" src="(https:\/\/abs.twimg.com\/responsive-web\/client-web(?:-legacy)?\/main.\w+.js)">/;
	public static readonly REGEXP_AUTHTOKEN = /="ACTION_REFRESH",(?:[a-z]="[^"]+",){2}[a-z]="([^"]+)",/;
	public static readonly REGEXP_QUERYID = /{queryId:"([^"]+)",operationName:"([^"]+)"/g;

	protected authToken? : string;
	protected guestToken? : string;
	protected queryIds? : Record<string, string>;

	private static instance? : TwitterTokenSource;

	public static getInstance() {
		if ( !TwitterTokenSource.instance ) {
			TwitterTokenSource.instance = new TwitterTokenSource();
		}

		return TwitterTokenSource.instance;
	}

	protected async fetchMainJSData() {
		const html = await fetch( 'https://twitter.com' ).then( r => r.text() );
		const jsurl = html.match( TwitterTokenSource.REGEXP_MAINJS );

		if ( jsurl === null ) {
			this.authToken = '';
			this.queryIds = {};
		} else {
			const js = await fetch( jsurl[1] ).then( r => r.text() );
			this.authToken = js.match( TwitterTokenSource.REGEXP_AUTHTOKEN )?.[1] ?? '';
			this.queryIds = Object.fromEntries( Array.from( js.matchAll( TwitterTokenSource.REGEXP_QUERYID ) ).map( m => [ m[2], m[1] ] ) );
		}

		return {
			authToken: this.authToken,
			queryIds: this.queryIds
		};
	}

	public async getAuthorizationToken( refresh : boolean = false ) : Promise<string> {
		return refresh || !this.authToken
			? ( await this.fetchMainJSData() ).authToken
			: this.authToken;
	}

	public async getGuestToken( refresh : boolean = false ) : Promise<string> {
		if ( refresh || !this.guestToken ) {
			const authToken = await this.getAuthorizationToken();

			this.guestToken = ( await fetch( 'https://api.twitter.com/1.1/guest/activate.json', {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + authToken
				}
			} ).then( r => r.json() ).then<string>( j => ( typeof j === 'object' ? j?.guest_token : null ) ?? '' ) );
		}

		return this.guestToken;
	}

	public async getQueryId( queryName : string, refresh : boolean = false ) : Promise<string> {
		let cache = this.queryIds;
		if ( refresh || !cache ) {
			cache = ( await this.fetchMainJSData() ).queryIds;
		}

		return cache[queryName] ?? '';
	}

	public async getTokens( refresh : boolean = false ) {
		return {
			authToken: await this.getAuthorizationToken( refresh ),
			guestToken: await this.getGuestToken( refresh )
		};
	}
}