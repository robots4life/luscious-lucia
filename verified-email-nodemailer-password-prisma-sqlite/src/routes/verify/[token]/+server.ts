import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';

export const GET: RequestHandler = async ({ params }) => {
	console.log(params);

	// pass the token value that is available on the params object to the validateEmailVerificationToken function
	// the returned value is a promise, so you need to await the result
	const foundTokenUser = await validateEmailVerificationToken(params.token);
	console.log(foundTokenUser);

	const body = JSON.stringify(foundTokenUser?.user_id);

	// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
	// new Response(body, options)
	return new Response(body);
};
