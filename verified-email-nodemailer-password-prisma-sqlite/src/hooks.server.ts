import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const handle: Handle = async ({ event, resolve }) => {
	// you can pass `event` because you used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};
