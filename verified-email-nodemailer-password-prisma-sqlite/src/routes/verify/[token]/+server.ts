import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ params, locals }) => {
	console.log(params);

	try {
		// pass the token value that is available on the params object to the validateEmailVerificationToken function
		// the returned value is a promise, so you need to await the result
		const foundTokenUser = await validateEmailVerificationToken(params.token);
		console.log('foundTokenUser : ');
		console.log(foundTokenUser);

		// check if a user with that token exists
		if (foundTokenUser) {
			console.log('token ok');
			// return new Response('token ok');

			// 1. Get the user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#getuser
			const user = await auth.getUser(foundTokenUser?.user_id);
			// 2. Update the user attribute
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#updateuserattributes
			await auth.updateUserAttributes(user.userId, {
				email_verified: true // Number(true) if stored as an integer
			});

			// 3. Invalidate all other possible Sessions of that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidateallusersessions
			await auth.invalidateAllUserSessions(user.userId);

			// 4. Set a new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#createsession
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {
					// here you can now set the current time, this is the timestamp where the verified user signed in to your app
					created_at: new Date().getTime()
				}
			});

			// 5. Set a cookie that holds the new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession
			locals.auth.setSession(session);

			// you cannot use SvelteKit's redirect function in an API route
			// use the Response object to redirect the user to the profile page
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/profile'
				}
			});
		}

		// remove the session cookie if there is an error with the token
		locals.auth.setSession(null);
		// if the user with that token cannot be found return an error message
		return new Response(
			'token expired - to get a new verification link return to the log in page and try again'
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error));
	}
};
