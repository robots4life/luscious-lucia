import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	console.log(params);

	const body = JSON.stringify(params);

	// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
	// new Response(body, options)
	return new Response(body);
};
