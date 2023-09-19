import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(client, {
		user: 'user', // model User {}
		key: 'key', // model Key {}
		session: 'session' // model Session {}
	}),
	getUserAttributes: (data) => {
		return {
			email: data.email,
			// Boolean(data.email_verified) if stored as an integer
			emailVerified: data.email_verified
		};
	},
	getSessionAttributes: (databaseSession) => {
		return {
			createdAt: databaseSession.created_at
		};
	}
});

export type Auth = typeof auth;
