interface FetchOptions {
	method? : 'GET'|'POST';
	headers? : Record<string, string>;
};

interface ResponseLike {
	json<T = any>() : Promise<T>;
	text() : Promise<string>;
};

export type FetchLike = ( url : string, options? : FetchOptions ) => Promise<ResponseLike>;
