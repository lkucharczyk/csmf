import { FetchLike } from '../types/fetchlike';

export default {
	fetch : ( window?.fetch ?? require( 'node-fetch' ) ) as FetchLike
};
