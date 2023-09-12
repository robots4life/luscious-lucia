import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	send_test_email: async ({ request }) => {
		const formData = await request.formData();

		const formEntires = [];
		for (const pair of formData.entries()) {
			console.log(`${pair[0]} : ${pair[1]}`);
			formEntires.push({ [pair[0]]: pair[1] });
		}

		return { formEntires };
	}
};
