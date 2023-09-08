import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		//
		// CREATE the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);
	}
} satisfies Actions;
