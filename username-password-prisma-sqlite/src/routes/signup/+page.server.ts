import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

import type { PageServerLoad } from './$types';

// the return {}; at the end of the try block below makes the
// load function for the signup page run once the form has been submitted
// and redirect the user to the profile page if the session is valid
//
// if we omit the return {}; from the end of the try block the load function WILL NOT run
// and the user will stay on the signup page
export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();
	if (session) {
		// we redirect the user to the profile page if the session is valid
		throw redirect(302, '/profile');
	}
	// since the load function needs to return data to the page we return an empty object
	return {};
};

export const actions = {
	default: async ({ request, locals }) => {
		//
		// CREATE the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);

		// basic check
		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			// use SvelteKit's fail function to return the error
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			// https://lucia-auth.com/reference/lucia/interfaces/auth#createuser
			// create a new user
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username
				}
			});

			// https://lucia-auth.com/reference/lucia/interfaces/auth#createsession
			// create a new session once the user is created
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession
			// store the session on the locals object and set session cookie
			locals.auth.setSession(session);

			// THIS IS VERY IMPORTANT
			// if we do not return any data from the form action
			// the load function for this page will not re-run
			// and thus not re-direct the authenticated user to the profile page
			//
			// for now we return the user in an object to the page to show the newly created user object
			// in later lessons the just becomes return {};
			return { user };
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
					// https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors
					return fail(400, { error: `Unique constraint failed on the ${e?.meta?.target}` });
				}
			}
			// Lucia error
			// https://lucia-auth.com/reference/lucia/modules/main#luciaerror
			if (e instanceof LuciaError) {
				// Lucia error
				console.log(e);
				return fail(500, { message: e });
			}
			// throw a SvelteKit redirect
			// https://kit.svelte.dev/docs/load#redirects
			// make sure you don't throw inside a try/catch block!
			throw redirect(302, '/');
		}
	}
} satisfies Actions;
