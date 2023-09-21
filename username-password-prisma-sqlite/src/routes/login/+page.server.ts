import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (session) {
		// we redirect the user to the profile page if the session is valid
		throw redirect(302, '/profile');
	}
	if (!session) {
		// we redirect the user to the index page if the session is not valid
		throw redirect(302, '/');
	}
	// since the load function needs to return data to the page we return an empty object
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		//
		// READ the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);

		// basic check
		if (typeof username !== 'string' || username.length < 1 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			// https://lucia-auth.com/reference/lucia/interfaces/auth#usekey
			// find user by key and check if the password is defined and check if the password is correct/valid
			const key = await auth.useKey('username', username.toLowerCase(), password);

			// https://lucia-auth.com/reference/lucia/interfaces/auth#createsession
			// create a new session once the user is validated
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			// https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession
			// store the session on the locals object and set session cookie
			locals.auth.setSession(session);
		} catch (e) {
			// Lucia error
			// https://lucia-auth.com/reference/lucia/modules/main#luciaerror
			// https://lucia-auth.com/basics/keys/#validate-keys
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist or invalid password
				return fail(400, {
					message: 'Incorrect email or password'
				});
			}
			// throw any other error that is not caught by above conditions
			return fail(400, { message: String(e) });
		}
		// throw a SvelteKit redirect if none of the error conditions apply
		// https://kit.svelte.dev/docs/load#redirects
		// make sure you don't throw inside a try/catch block!
		// throw redirect(302, '/');
		// if we want the load function to run and the page to be re-rendered after
		// the form action has complete we omit the redirect and handle further logic in the load function
	}
};
