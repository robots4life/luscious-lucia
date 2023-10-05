import { generateRandomString } from 'lucia/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const generateEmailVerificationToken = async (userId: string) => {
	// get the current time (UNIX) in milliseconds
	const current_time_in_milliseconds = new Date().getTime();
	console.log('current_time_in_milliseconds : ' + current_time_in_milliseconds);

	// create amount of time before the token expires
	// const token_expires_in_time = 1000 * 60; // TEST => 60 seconds
	const token_expires_in_time = 1000 * 60 * 60 * 2; // => 7200000 milliseconds => 2 hours
	console.log('token_expires_in_time : ' + token_expires_in_time);

	// create amount of time before the token expires time is too short to still use the token
	// const token_still_useable_time = 1000 * 40; // TEST => 40 seconds
	const token_still_useable_time = 1000 * 60 * 20; // => 1200000 => 20 minutes
	console.log('token_still_useable_time : ' + token_still_useable_time);

	// rewrite using Prisma interactive transactions
	// https://www.prisma.io/docs/concepts/components/prisma-client/transaction
	// https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions

	const token = await prisma.$transaction(async (tx) => {
		// 1. get the token from this user where the token expires time is greater than the current time plus 20 minutes
		const useableToken = await tx.emailToken.findMany({
			where: {
				user_id: userId,
				expires: {
					gt: current_time_in_milliseconds + token_still_useable_time
				}
			}
		});

		// 2. if there is no token whose expires time is greater than the current time plus 20 minutes
		if (useableToken.length === 0) {
			// delete previous token for this user
			await tx.emailToken.deleteMany({
				where: {
					user_id: userId
				}
			});

			// create a new token for the user
			const token = generateRandomString(128, '0123456789abcdefghijklmnopqrstuvwxyz');
			console.log('token : ' + token);

			// add the new token to the EmailToken Model for the newly created user with the id being user.userId
			const emailToken = await tx.emailToken.create({
				data: {
					id: token,
					expires: current_time_in_milliseconds + token_expires_in_time,
					user_id: userId
				}
			});

			// for now log the created emailToken
			console.log(emailToken);
			// you are returning a Promise here
			return token;
		}

		// 3. if there is a single token whose expires time is greater than the current time plus 20 minutes
		if (useableToken.length === 1 && typeof useableToken[0].id === 'string') {
			// you are returning the token id here as a string
			console.log('useableToken : ');
			console.log(useableToken);
			return useableToken[0].id;
		}
	});
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
