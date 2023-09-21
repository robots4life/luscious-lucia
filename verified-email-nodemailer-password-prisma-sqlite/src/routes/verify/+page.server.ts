import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('VERIFY page load function logs session : ' + JSON.stringify(session?.user));
	return {};
};
