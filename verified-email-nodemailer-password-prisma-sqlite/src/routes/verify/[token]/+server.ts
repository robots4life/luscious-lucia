import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ params, locals }) => {
	console.log(params);

	try {
		// pass the token value that is available on the params object to the validateEmailVerificationToken function
		// the returned value is a promise, so you need to await the result
		const foundTokenUser = await validateEmailVerificationToken(params.token);
		console.log(foundTokenUser);

		// 1. Get the user with Lucia
		const user = await auth.getUser(foundTokenUser?.user_id);

		// 2. Update the user attribute
		await auth.updateUserAttributes(user.userId, {
			email_verified: true // `Number(true)` if stored as an integer
		});

		// 3. Invalidate all other possible Sessions of that user with Lucia
		await auth.invalidateAllUserSessions(user.userId);

		// 4. Set a new Session for that user with Lucia
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		// 5. Set a cookie that holds the new Session for that user with Lucia
		locals.auth.setSession(session);

		const body = JSON.stringify(foundTokenUser?.user_id);

		// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
		// new Response(body, options)
		return new Response(body);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error));
	}
};
