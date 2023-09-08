import { auth } from '$lib/server/lucia';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		//
		// CREATE the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);

		// basic check
		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			// use SvelteKit's fail function to return the error
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username
				}
			});
			// const session = await auth.createSession({
			// 	userId: user.userId,
			// 	attributes: {}
			// });
			// locals.auth.setSession(session); // set session cookie
			// console.log(`user : ` + user);

			// let's return the created user back to the sign up page
			return { user };
		} catch (e) {
			console.log(e);
		}
	}
} satisfies Actions;
