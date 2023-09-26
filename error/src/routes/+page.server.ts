import { asyncTask } from '$lib/tasks';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.actionFail > 0) {
		console.log('load');
		// redirect the user to the verify page
		throw redirect(302, '/verify');
	}
};

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
				console.log('action');
				locals.actionFail = 1;

				// does not work
				// throw error(500, String('default form action : asyncResult is not a string !'));
				//
				// does work
				throw new Error(String('default form action : asyncResult is not a string !'));
			}
			return { date: new Date(), default_form_number };
		} catch (e) {
			// does not work
			// return fail(500, { message: String(e.message) });
			//
			// does work
			throw error(500, String(e.message));
		}
	}
};
