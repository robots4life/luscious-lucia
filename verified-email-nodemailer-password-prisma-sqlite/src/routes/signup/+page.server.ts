import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const email = form_data.get('send_email');
		console.log(email);

		const password = form_data.get('send_password');
		console.log(password);

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
};
