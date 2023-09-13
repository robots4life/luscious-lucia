import nodemailer from 'nodemailer';

// define the Nodemailer transporter with the Ethereal account details
const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: 'conner.white16@ethereal.email',
		pass: 'MvPJdfrde3Uz8zewR6'
	}
});

// define a sendVerificationMessage function with parameters for the message
async function sendVerificationMessage(to: string, subject: string, text: string, html = '') {
	try {
		const info = await transporter.sendMail({
			from: 'conner.white16@ethereal.email', // sender address
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
			const info = sendVerificationMessage(
				'conner.white16@ethereal.email',
				'Email Verification',
				text + number
			);
			// return the info object to the email page
			return info;
		}
	}
};
