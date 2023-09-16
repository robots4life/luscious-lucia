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
export async function sendVerificationMessage(to: string, token: string) {
	const subject = 'Awesome App - Verification Link';
	const text = `
Hello ${to}, please open on this verification link in your browser to verify your email address, thank you.
	
http://localhost:5173/verify/${token}

Awesome App Team
`;

	const html = `
Hello ${to},<br /><br />

please click on this verification link to verify your email address, thank you.<br /><br />
	
<a href="http://localhost:5173/verify/${token}">Verify Your Email Address</a><br /><br />

<strong>Awesome App Team</strong>
`;
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
		// you are returning a Promise here
		// return the info object after sending the message
		return info;
	} catch (error) {
		console.log(error);
	}
}
