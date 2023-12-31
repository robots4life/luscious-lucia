import { EMAIL_HOST, EMAIL_PORT, EMAIL_AUTH_USER, EMAIL_AUTH_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';

// define the Nodemailer transporter with the Ethereal account details
const transporter = nodemailer.createTransport({
	host: EMAIL_HOST,
	port: EMAIL_PORT,
	auth: {
		user: EMAIL_AUTH_USER,
		pass: EMAIL_AUTH_PASS
	}
});

// define a sendVerificationMessage function with parameters for the message
async function sendVerificationMessage(to: string, subject: string, text: string, html = '') {
	try {
		const info = await transporter.sendMail({
			from: EMAIL_AUTH_USER, // sender address
			to: to, // list of receivers
			subject: subject, // Subject line
			text: text, // plain text body
			html: html // html body
		});
		console.log('Message sent: %s', info.messageId);
		//
		// return the info object after sending the message
		return info;
	} catch (error) {
		console.log(error);
	}
}

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const text = form_data.get('send_text');
		console.log(text);

		const number = form_data.get('send_number');
		console.log(number);

		// call the sendVerificationMessage function and pass the message arguments
		if (typeof text === 'string' && typeof number === 'string') {
			//
			// const info will hold the return value of the above return info
			const info = sendVerificationMessage(EMAIL_AUTH_USER, 'Email Verification', text + number);
			// return the info object to the email page
			return info;
		}
	}
};
