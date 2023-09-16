import { generateRandomString } from 'lucia/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const generateEmailVerificationToken = async (userId: string) => {
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
			user_id: userId
		}
	});
	// for now log the created emailToken
	console.log(emailToken);

	// you are returning a Promise here
	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const userEmailToken = await prisma.emailToken.findUnique({
		where: {
			id: token
		}
	});
	// log the token from that user
	console.log(userEmailToken);

	// you are returning a Promise here
	return userEmailToken;
};
