import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('PROFILE page load function logs session : ' + JSON.stringify(session?.user));

	// if there is a session and if the session holds a user with a verified email address
	if (session && session.user.emailVerified) {
		// check in the terminal to see what data the session holds
		console.log(session);

		// return the user data stored on the session
		return {
			userId: session.user.userId,
			email: session.user.email,
			signedInAt: Number(session.createdAt)
		};
	}
	// if there is a session and the session DOES NOT not hold a user with a verified email address
	if (session && !session.user.emailVerified) {
		// redirect the user back to verify page
		throw redirect(302, '/verify');
	}
	// redirect all other cases to the app index page for now
	throw redirect(302, '/');
};

import type { Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();

		// if there is no session then the user is forbidden to access this
		// https://en.wikipedia.org/wiki/HTTP_403
		if (!session) {
			return fail(401);
		}

		if (session) {
			// invalidate session
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidatesession
			await auth.invalidateSession(session.sessionId);

			// remove cookie
			// https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession
			locals.auth.setSession(null);

			// redirect to the app index page for now
			throw redirect(302, '/');
		}

		// redirect all other cases to the app index page for now
		throw redirect(302, '/');
	}
};
