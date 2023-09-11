import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
