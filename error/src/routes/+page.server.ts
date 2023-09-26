import { asyncTask } from '$lib/tasks';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const asyncResult = await asyncTask();
		console.log(asyncResult);

		// if (typeof asyncResult === 'undefined') {
		// 	throw new Error(String('default form action : asyncResult is undefined !'));
		// }

		// if (typeof asyncResult === 'number') {
		// 	throw new Error(String('default form action : asyncResult is not a string !'));
		// }

		return { date: new Date(), asyncResult };
	} catch (e) {
		throw error(500, String(e.message));
	}
};

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const default_form_number = form_data.get('default_form_number');
		console.log(default_form_number);

		try {
			const asyncResult = await asyncTask();
			console.log(asyncResult);

			if (typeof asyncResult === 'undefined') {
				throw new Error(String('default form action : asyncResult is undefined !'));
			}

			if (typeof asyncResult === 'number') {
				throw new Error(String('default form action : asyncResult is not a string !'));
			}
			return { date: new Date(), default_form_number };
		} catch (e) {
			// throw error(500, String(e.message));
			return fail(500, { message: String(e.message) });
		}
	}
};
