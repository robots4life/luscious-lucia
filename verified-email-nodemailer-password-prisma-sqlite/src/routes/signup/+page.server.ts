import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/isValidEmail';
import { auth } from '$lib/server/lucia';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendVerificationMessage } from '$lib/server/message/sendVerificationLink';
import { LuciaError } from 'lucia';
import { Prisma } from '@prisma/client';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form_data = await request.formData();

		const email = form_data.get('send_email');
		console.log(email);

		const password = form_data.get('send_password');
		console.log(password);

		// basic check
		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'email', // auth method
					providerUserId: email.toLowerCase(), // unique id when using "email" auth method
					password // hashed by Lucia
				},
				attributes: {
					email: email.toLowerCase(),
					email_verified: false // `Number(false)` if stored as an integer
				}
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {
					// set this field to 0 since the new user has so far not verified their email address and hence also not signed in to your app
					created_at: 0
				}
			});
			locals.auth.setSession(session); // set session cookie

			// create the token for the user
			const token = await generateEmailVerificationToken(user.userId);
			console.log(token);

			// send the user an email message with a verification link
			const message = await sendVerificationMessage(email, token);
			console.log(message);

			// for now log the created user
			console.log(user);
		} catch (e) {
			//
			// Prisma error
			// https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				//
				// https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
				// The .code property can be accessed in a type-safe manner
				if (e.code === 'P2002') {
					console.log(`Unique constraint failed on the ${e?.meta?.target}`);
					console.log('\n');
					console.log('e : ' + e);
					console.log('e.meta : ' + e?.meta);
					console.log('e.meta.target : ' + e?.meta?.target);

					// return the error to the page with SvelteKit's fail function
					return fail(400, { error: `Unique constraint failed on the field ${e?.meta?.target}` });
				}
			}
			// Lucia error
			// https://lucia-auth.com/reference/lucia/modules/main#luciaerror
			if (e instanceof LuciaError) {
				// Lucia error
				console.log(e);
			}
			// throw any other error that is not caught by above conditions
			throw e;
		}

		// for now you return the received form values back to the signup page
		// return { timestamp: new Date(), email, password };

		// instead of returning the form values back to the user
		// you now redirect the signed up user to the "verify" page
		throw redirect(302, '/verify');
	}
} satisfies Actions;
