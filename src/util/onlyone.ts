export function onlyone(
	prototype: Object,
	key: string,
	descriptor: TypedPropertyDescriptor<() => Promise<any>>
) {
	const original = descriptor.value;

	if ( original ) {
		const promises = new Map<Object, Promise<any>>();

		descriptor.value = function() {
			let promise = promises.get( this );

			if ( !promise ) {
				promise = original.apply( this );

				promises.set( this, promise );
				promise.then( () => promises.delete( this ) );
			}

			return promise;
		};
	}

	return descriptor;
};
