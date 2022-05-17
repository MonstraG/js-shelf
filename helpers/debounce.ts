export const debounce = (func: Function, limit: number = 250) => {
	let timeout: ReturnType<typeof setTimeout>;
	let debounceActive = false;
	let debouncing = false; // was there even a call to debounce
	return (...args: any[]) => {
		if (debounceActive) {
			debouncing = true;
			clearTimeout(timeout);
		} else {
			func.apply(null, args);
			debounceActive = true;
		}

		timeout = setTimeout(() => {
			if (debouncing) {
				func.apply(null, args);
			}
			debounceActive = false;
			debouncing = false;
		}, limit);
	};
};
