export const asyncTask = async () => {
	const taskPromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(123456789);
		}, 500);
	});
	return taskPromise;
};
