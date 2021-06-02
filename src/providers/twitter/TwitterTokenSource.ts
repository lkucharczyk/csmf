const fetch = window?.fetch ?? require( 'node-fetch' );

export class TwitterTokenSource {
	public static readonly REGEXP_MAINJS = /<script type="text\/javascript" charset="utf-8" nonce="[^"]+" crossorigin="anonymous" src="(https:\/\/abs.twimg.com\/responsive-web\/client-web(?:-legacy)?\/main.\w+.js)">/;
	public static readonly REGEXP_AUTHTOKEN = /="ACTION_REFRESH",(?:[a-z]="[^"]+",){2}[a-z]="([^"]+)",/;

	private static instance? : TwitterTokenSource;

	public static getInstance() {
		if ( !TwitterTokenSource.instance ) {
			TwitterTokenSource.instance = new TwitterTokenSource();
		}

		return TwitterTokenSource.instance;
	}

	public async getAuthorizationToken() : Promise<string> {
		const html = await fetch( 'https://twitter.com' ).then( r => r.text() );
		const jsurl = html.match( TwitterTokenSource.REGEXP_MAINJS );
		if ( jsurl === null ) {
			return '';
		}

		const js = await fetch( jsurl[1] ).then( r => r.text() );
		return js.match( TwitterTokenSource.REGEXP_AUTHTOKEN )?.[1] ?? '';
	}

	public async getGuestToken( authToken : string ) : Promise<string> {
		if ( authToken === '' ) {
			return '';
		}

		return await fetch( 'https://api.twitter.com/1.1/guest/activate.json', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + authToken
			}
		} ).then( r => r.json() ).then( j => ( typeof j === 'object' ? j?.guest_token : null ) ?? '' );
	}

	public async getTokens( refresh : boolean = false ) {
		const authToken = await this.getAuthorizationToken();
		return {
			authToken,
			guestToken: await this.getGuestToken( authToken )
		};
	}
}