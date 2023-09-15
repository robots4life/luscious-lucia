import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/isValidEmail';
import { auth } from '$lib/server/lucia';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendVerificationMessage } from '$lib/server/message/sendVerificationLink';

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

			// create the token for the user
			const token = await generateEmailVerificationToken(user.userId);
			console.log(token);

			// send the newly created user an email message with the verification link
			const subject = 'Awesome App - Verification Link';
			const text = `
Hello ${email}, please open on this verification link in your browser to verify your email address, thank you.
			
http://localhost:5173/verify/${token}

Awesome App Team
`;
			const html = `
Hello ${email},<br /><br />

please click on this verification link to verify your email address, thank you.<br /><br />
			
<a href="http://localhost:5173/verify/${token}">Verify Your Email Address</a><br /><br />

<strong>Awesome App Team</strong>
`;
			const message = await sendVerificationMessage(email, subject, text, html);
			console.log(message);

			// for now log the created user
			console.log(user);
		} catch (error) {
			console.log(error);
		}

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
} satisfies Actions;
