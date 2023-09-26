import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('VERIFY page load function logs session : ' + JSON.stringify(session?.user));

	// if there is no session
	if (!session) {
		// redirect the user to the home page
		throw redirect(302, '/');
	}
	// if there is a session and the user's email address in verified
	if (session && session.user.emailVerified) {
		// redirect the user to the profile page
		throw redirect(302, '/profile');
	}
};
