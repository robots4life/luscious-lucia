import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/isValidEmail';
import { auth } from '$lib/server/lucia';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form_data = await request.formData();

		const email = form_data.get('send_email');
		console.log(email);

		const password = form_data.get('send_password');
		console.log(password);

		// basic check
		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			// find user by key and validate password
			// https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit/#authenticate-users
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#usekey
			// https://lucia-auth.com/basics/keys/#email--password
			const keyUser = await auth.useKey('email', email.toLowerCase(), password);

			const session = await auth.createSession({
				userId: keyUser.userId,
				attributes: {
					// here you can now set the current time, this is the timestamp where the verified user signed in to your app
					created_at: new Date().getTime()
				}
			});
			locals.auth.setSession(session); // set session cookie

			// for now log the logged in user
			console.log(keyUser);
		} catch (error) {
			console.log(error);
		}

		// you now redirect the logged in user to the "profile" page
		throw redirect(302, '/profile');
	}
} satisfies Actions;
