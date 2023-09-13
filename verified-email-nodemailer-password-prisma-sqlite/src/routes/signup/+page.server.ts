import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/email';

export const actions: Actions = {
	default: async ({ request }) => {
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

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
};
