import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (!session) {
		// if the session is not valid we redirect the user back to the index page
		throw redirect(302, '/');
	}
	// if the user session is validated we return the user data to the profile page
	return {
		userId: session.user.userId,
		username: session.user.username
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		// https://lucia-auth.com/reference/lucia/interfaces/auth#invalidatesession
		await auth.invalidateSession(session.sessionId); // invalidate session

		// https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession
		locals.auth.setSession(null); // remove cookie

		throw redirect(302, '/'); // redirect to index page
	}
};
