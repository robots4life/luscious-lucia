import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/email';
import { auth } from '$lib/server/lucia';

import { generateRandomString } from 'lucia/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie

			// create a new token
			const token = generateRandomString(128, '0123456789abcdefghijklmnopqrstuvwxyz');
			console.log('token : ' + token);

			// create amount of time before the token expires
			const token_expires_in_time = 1000 * 60 * 60 * 2;
			console.log('token_expires_in_time : ' + token_expires_in_time); // => 7200000 milliseconds

			// get the current time (UNIX) in milliseconds
			const current_time_in_milliseconds = new Date().getTime();
			console.log('current_time_in_milliseconds : ' + current_time_in_milliseconds);

			// add up the current time and the time until the token expires
			const token_expires_at_this_time = current_time_in_milliseconds + token_expires_in_time;
			console.log('token_expires_at_this_time : ' + token_expires_at_this_time);

			// add the new token to the EmailToken Model for the newly created user with the id being user.userId
			const emailToken = await prisma.emailToken.create({
				data: {
					id: token,
					expires: token_expires_at_this_time,
					user_id: user.userId
				}
			});
			// for now log the created emailToken
			console.log(emailToken);

			// for now log the created user
			console.log(user);
		} catch (error) {
			console.log(error);
		}

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
} satisfies Actions;
