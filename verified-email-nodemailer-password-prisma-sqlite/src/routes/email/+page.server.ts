import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const text = form_data.get('send_text');
		console.log(text);

		const number = form_data.get('send_number');
		console.log(number);
	}
};
