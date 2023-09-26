import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.actionFail = 0;
	const response = await resolve(event);
	return response;
};
