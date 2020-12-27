export const booleanValue = (value) => {
	if (typeof value === 'boolean') {
		return value ? 1 : 0;
	}
	return 0;
};
