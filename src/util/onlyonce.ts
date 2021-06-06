export function onlyonce(
	prototype: Object,
	key: string,
	descriptor: TypedPropertyDescriptor<() => any>
) {
	const original = descriptor.value;

	if ( original ) {
		const values = new Map<Object, Promise<any>>();

		descriptor.value = function() {
			if ( !values.has( this ) ) {
				values.set( this, original.apply( this ) );
			}

			return values.get( this );
		};
	}

	return descriptor;
};
