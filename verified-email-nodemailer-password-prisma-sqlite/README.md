<img src="/lucia.png">

# Authentication with Email, authenticated by verification link, Nodemailer, Password and Password Reset Link using SvelteKit, Lucia, Prisma and SQLite

I am using `pnpm` and these aliases and oh my zsh.

<a href="https://pnpm.io/" target="_blank">https://pnpm.io/</a>

<a href="https://pnpm.io/installation#using-a-shorter-alias" target="_blank">https://pnpm.io/installation#using-a-shorter-alias</a>

<a href="https://ohmyz.sh/" target="_blank">https://ohmyz.sh/</a>

`.zshrc`

```bash
alias pi='pnpm install'
alias pa='pnpm add'
alias px="pnpm dlx"
```

## Table of Contents

## 1.0 Set up Email

For sending emails from our app you are going to use <a href="https://nodemailer.com/" target="_blank">https://nodemailer.com/</a>.

During development you are going to preview / check sent email with <a href="https://ethereal.email/" target="_blank">https://ethereal.email/</a>.

Once everything works in development you are going to use a free <a href="https://sendgrid.com/pricing/" target="_blank">https://sendgrid.com/pricing/</a> SendGrid account that allows us to send up to 100 emails per day.

### 1.1 Set up basic app styles, layout and email page with a SvelteKit default form action

Create an **app.css** file in the **src** folder with following contents.

**src/app.css**

```css
/* https://andy-bell.co.uk/a-modern-css-reset/ START */
/* Box sizing rules */
*,
*::before,
*::after {
	box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
	margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
	list-style: none;
}

/* Set core root defaults */
html:focus-within {
	scroll-behavior: smooth;
}

/* Set core body defaults */
body {
	min-height: 100vh;
	text-rendering: optimizeSpeed;
	line-height: 1.5;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
	text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
	max-width: 100%;
	display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
	font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
	html:focus-within {
		scroll-behavior: auto;
	}

	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
/* https://andy-bell.co.uk/a-modern-css-reset/ END */

html {
	background-color: #002244;
	color: blanchedalmond;
}

body {
	padding: 2rem;
}

body,
form,
input,
button,
a {
	font-family: sans-serif;
	font-size: 1.6rem;
}
a {
	color: whitesmoke;
}
a:hover {
	color: green;
}
```

Create a **+layout.svelte** file in the **src/routes** folder with following contents.

```html
<script lang="ts">
	import '../app.css';
</script>

<slot />
```

Create an `email` page, so create a folder `email` in the **src/routes** folder.

In **src/routes/email** create a **+page.svelte** and a **+page.server.ts** file.

**src/routes/email/+page.svelte**

```html
<script lang="ts">
	// export the form property on this page
	// to show the return value of the form action on the page
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<a href="/">Home</a>

<hr />
<h1>Email</h1>
<hr />

<h2>Send Test Email</h2>
<form id="send_test_email" method="POST">
	<label for="send_text">Text</label>
	<input type="text" name="send_text" id="send_text" value="Lorem Ipsum Email Text" />
	<label for="send_number">Number</label>
	<input type="number" name="send_number" id="send_number" value="123456789" />
	<button form="send_test_email" type="submit">Submit</button>
</form>

<!-- show the return value from the form action -->
<pre>{JSON.stringify(form, null, 2)}</pre>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	button {
		border-radius: 10px;
	}
</style>
```

<a href="https://kit.svelte.dev/docs/form-actions#default-actions" target="_blank">https://kit.svelte.dev/docs/form-actions#default-actions</a>

**src/routes/email/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const text = form_data.get('send_text');
		console.log(text);

		const number = form_data.get('send_number');
		console.log(number);
	}
};
```

Add a link to the `email` page to the index page.

In **src/routes/+page.svelte** add a link.

```html
<a href="/email">Send Test Email</a>
<hr />

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
```

Start the development server.

`npm run dev`

`p dev`

Go to the `email` page <a href="http://localhost:5173/email" target="_blank">http://localhost:5173/email</a>.

Hit the `Submit` button on the form a few times, in your terminal you should see the following output.

```bash
Lorem Ipsum Email Text
123456789
Lorem Ipsum Email Text
123456789
Lorem Ipsum Email Text
123456789
```

Well done, you have just set up basic app styles, a layout and an `email` page with a SvelteKit named form action. :tada:

### 1.2 Install Nodemailer and types for Nodemailer

Install Nodemailer as a dependency.

<a href="https://nodemailer.com/usage/" target="_blank">https://nodemailer.com/usage/</a>

`npm install nodemailer`

`pi nodemailer`

```bash
Packages: +1
+
Progress: resolved 244, reused 221, downloaded 1, added 1, done

dependencies:
+ nodemailer 6.9.5

Done in 1.3s
```

Install types for Nodemailer as a development dependency.

<a href="https://www.npmjs.com/package/@types/nodemailer" target="_blank">https://www.npmjs.com/package/@types/nodemailer</a>

`npm install --save @types/nodemailer`

`pa -D @types/nodemailer`

```bash
Packages: +2
++
Progress: resolved 246, reused 224, downloaded 0, added 2, done

devDependencies:
+ @types/nodemailer 6.4.10

Done in 1s
```

### 1.3 Create an Ethereal email test account

Ethereal is a fake SMTP service. It's a completely free email service where messages you send during development can be easily previewed.

Go to <a href="https://ethereal.email/" target="_blank">https://ethereal.email/</a>.

Click on the blue `Create Etheral Account` button.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/create_ethereal_account.png">

You will be redirected to <a href="https://ethereal.email/create" target="_blank">https://ethereal.email/create</a> and see your Etheral account details.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_account_details.png">

You are interested in the `Nodemailer configuration`.

```ts
const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: 'conner.white16@ethereal.email',
		pass: 'MvPJdfrde3Uz8zewR6'
	}
});
```

### 1.4 Send verification email with Nodemailer to your Ethereal email test account

Nodemailer has a nice example of how to send email.

<a href="https://nodemailer.com/about/#example" target="_blank">https://nodemailer.com/about/#example</a>

You are going to use that in the `+page.server.ts` file of the `email` page.

**src/routes/email/+page.server.ts**

```ts
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
```

Go to the `email` page <a href="http://localhost:5173/email" target="_blank">http://localhost:5173/email</a>, the form values should already be given, `Lorem Ipsum Email Text` and `123456789`.

Submit the `form` and check your terminal.

```bash
VITE v4.4.9  ready in 907 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
Lorem Ipsum Email Text
123456789
Message sent: <565d5b32-97ef-2f7d-1bea-f278310bfc0c@ethereal.email>
```

Go to <a href="https://ethereal.email/messages" target="_blank">https://ethereal.email/messages</a> and find the email message you just sent.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_message.png">

Click on the message subject to see the message details.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_message_details.png">

On the `email` page you should also see the returned `info` object from the form action.

<img src="/verified-email-nodemailer-password-prisma-sqlite//docs/ethereal_message_info_object_email_page.png">

```ts
{
  "accepted": [
    "conner.white16@ethereal.email"
  ],
  "rejected": [],
  "ehlo": [
    "PIPELINING",
    "8BITMIME",
    "SMTPUTF8",
    "AUTH LOGIN PLAIN"
  ],
  "envelopeTime": 124,
  "messageTime": 146,
  "messageSize": 338,
  "response": "250 Accepted [STATUS=new MSGID=ZQFaVM2l51sVUMSAZQFvz.NxowjZr8xpAAAAEHlXMIYgvu333s427ccaSNs]",
  "envelope": {
    "from": "conner.white16@ethereal.email",
    "to": [
      "conner.white16@ethereal.email"
    ]
  },
  "messageId": "<0071024c-878f-3c88-afba-939e73e96eec@ethereal.email>"
}
```

Well done, you

- set up `nodemailer`
- and use an Ethereal email test account
- to send emails
- using form data from your `email` page. :tada:

## 2.0 Set up Prisma

You are going to use Prisma with an SQLite database with SvelteKit.

### 2.1 Add Prisma extension to VS Code

Add the Prisma extension to VS Code.

Extension id `Prisma.prisma`

<a href="https://marketplace.visualstudio.com/items?itemName=Prisma.prisma" target="_blank">https://marketplace.visualstudio.com/items?itemName=Prisma.prisma</a>

Add these settings for the Prisma extension in your `settings.json`. This formats your `schema.prisma` file on save.

```json
"[prisma]": {
  "editor.defaultFormatter": "Prisma.prisma",
  "editor.formatOnSave": true
},
```

### 2.2. Install Prisma CLI

Install the Prisma CLI as a development dependency in the project.

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#installation" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#installation</a>

<a href="https://pnpm.io/cli/install#--dev--d" target="_blank">https://pnpm.io/cli/install#--dev--d</a>

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#pnpm" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#pnpm</a>

`npm install prisma --save-dev`

`pi prisma -D`

```bash
Packages: +2
++
Progress: resolved 248, reused 226, downloaded 0, added 2, done

devDependencies:
+ prisma 5.2.0

Done in 2.5s
```

### 2.3 Set up Prisma with SQLite database

Set up Prisma with the `init` command of the Prisma CLI and choose `sqlite` as database.

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#usage" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#usage</a>

If you installed Prisma as a development dependency, you need to prefix the `prisma` command with your package runner.

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#run-prisma-init---datasource-provider-sqlite" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#run-prisma-init---datasource-provider-sqlite</a>

`npx prisma init --datasource-provider sqlite`

`px prisma init --datasource-provider sqlite`

```bash
Packages: +2
++
Progress: resolved 2, reused 2, downloaded 0, added 2, done

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started`
```

### 2.4 Set up Prisma Schema for email verification

The default Prisma schema for Lucia has a `User`, `Key` and `Session` model.

<a href="https://lucia-auth.com/database-adapters/prisma#prisma-schema" target="_blank">https://lucia-auth.com/database-adapters/prisma#prisma-schema</a>

For email verification you need a new Model `EmailToken`.

**prisma/schema.prisma**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// https://lucia-auth.com/database-adapters/prisma#prisma-schema
model User {
  id             String       @id @unique
  email          String       @unique // <== make sure to add email and
  email_verified Boolean // <== email_verified as User attributes !!
  auth_session   Session[]
  key            Key[]
  EmailToken     EmailToken[]
}

model Key {
  id              String  @id @unique
  hashed_password String?
  user_id         String
  user            User    @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
}

model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  user           User   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
}

model EmailToken {
  id      String @id @unique
  expires BigInt
  user_id String
  user    User   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
}
```

### 2.5 Generate SQLite database with Prisma Schema

Now it is time to generate the SQLite database according to the Prisma Schema.

<a href="https://www.prisma.io/docs/getting-started/quickstart#3-run-a-migration-to-create-your-database-tables-with-prisma-migrate" target="_blank">https://www.prisma.io/docs/getting-started/quickstart#3-run-a-migration-to-create-your-database-tables-with-prisma-migrate</a>

Run the following command in your terminal to create the SQLite database and the

- **User**
- **Key**
- **Session**
- and **EmailToken**

**tables** represented by your **models** defined in in your **Prisma Schema**.

`npx prisma migrate dev --name init`

`px prisma migrate dev --name init`

This command does two things.

1. It creates a new SQL migration file for this migration in the prisma/migrations directory.
2. It runs the SQL migration file against the database.

Because the SQLite database file didn't exist before, the command also created it inside the prisma directory with the name `dev.db` as defined via the environment variable in the `.env` file.

```bash
Packages: +2
++
Progress: resolved 2, reused 2, downloaded 0, added 2, done
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

Applying migration `20230913162923_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230913162923_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.2.0) to ./node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client in 123ms
```

**.env**

```bash
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```

Well done, you have set up Prisma and a SQLite database for your app. :tada:

## 3.0 Add Lucia to SvelteKit

You are going to use Lucia for authentication.

<a href="https://lucia-auth.com/" target="_blank">https://lucia-auth.com/</a>

### 3.1 Install Lucia and install Adapter Prisma for Lucia

<a href="https://lucia-auth.com/getting-started/sveltekit" target="_blank">https://lucia-auth.com/getting-started/sveltekit</a>

`npm install lucia`

`pa lucia`

```bash
Packages: +1
+
Progress: resolved 249, reused 227, downloaded 0, added 1, done

dependencies:
+ lucia 2.5.0

Done in 1.6s
```

<a href="https://lucia-auth.com/database-adapters/prisma#installation" target="_blank">https://lucia-auth.com/database-adapters/prisma#installation</a>

`npm i @lucia-auth/adapter-prisma`

`pa @lucia-auth/adapter-prisma`

```bash
Packages: +3
+++
Progress: resolved 252, reused 228, downloaded 2, added 3, done
node_modules/.pnpm/@prisma+client@5.3.0_prisma@5.2.0/node_modules/@prisma/client: Running postinstall script, done in 2.8s

dependencies:
+ @lucia-auth/adapter-prisma 3.0.1

Done in 6.1s
```

### 3.2 Initialize Lucia

<a href="https://lucia-auth.com/getting-started/sveltekit#initialize-lucia" target="_blank">https://lucia-auth.com/getting-started/sveltekit#initialize-lucia</a>

Import `lucia()` from `lucia` and initialize it in its own module (file). Export `auth` and its type as `Auth`. Make sure to pass the `sveltekit()` middleware.

Create a new file `lucia.ts` in the folder `src/lib/server`.

We’ll expose the user’s `email` and `emailVerified` to the `User` object by defining `getUserAttributes`.

<a href="https://lucia-auth.com/basics/configuration#getuserattributes" target="_blank">https://lucia-auth.com/basics/configuration#getuserattributes</a>

**src/lib/server/lucia.ts**

```ts
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
	}
});

export type Auth = typeof auth;
```

### 3.3. Set up types for Lucia

<a href="https://lucia-auth.com/getting-started/sveltekit#set-up-types" target="_blank">https://lucia-auth.com/getting-started/sveltekit#set-up-types</a>

In your `src/app.d.ts` file, declare a `Lucia` namespace. The import path for `Auth` is where you initialized `lucia()`.

**src/app.d.ts**

```ts
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// https://lucia-auth.com/getting-started/sveltekit#set-up-types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			// required Prisma Schema fields (i.e. id) should not be defined here
			email: string;
			email_verified: boolean;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
```

### 3.4 Set up hooks to store `Auth.request()` on the `locals.auth` object

<a href="https://lucia-auth.com/getting-started/sveltekit#set-up-hooks" target="_blank">https://lucia-auth.com/getting-started/sveltekit#set-up-hooks</a>

**This is optional but highly recommended**.

<a href="https://kit.svelte.dev/docs/hooks#server-hooks-handle" target="_blank">https://kit.svelte.dev/docs/hooks#server-hooks-handle</a>

Create a new `handle()` hook that stores `AuthRequest` to `locals.auth`.

<a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest</a>

`locals.auth` will store the `Auth.request()` methods `setSession()`, `validate()` and `validateBearerToken()`.

Create a new file `hooks.server.ts` in the `src` folder. Note, there is no `+` in front of the file name !

**src/hooks.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// you can pass `event` because you used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};
```

## 4.0 Create users in the database

Before you create or validate tokens you need to create a `signup` page with a form that will allow new users to sign up / register to your app.

### 4.1 Create a Sign up page

Create a `+page.svelte` file in the folder `src/routes/signup`.

**src/routes/signup/+page.svelte**

```html
<script lang="ts">
	// export the form property on this page
	// to show the return value of the form action on the page
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<a href="/">Home</a>

<hr />
<h1>Sign Up</h1>
<hr />

<h2>Sign Up With Email</h2>
<form id="sign_up_with_email" method="POST">
	<label for="send_email">Email</label>
	<input type="text" name="send_email" id="send_email" value="conner.white16@ethereal.email" />
	<label for="send_password">Password</label>
	<input type="password" name="send_password" id="send_password" value="0123456789876543210" />
	<button form="sign_up_with_email" type="submit">Submit</button>
</form>

<!-- show the return value from the form action -->
<pre>{JSON.stringify(form, null, 2)}</pre>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	button {
		border-radius: 10px;
	}
</style>
```

Create a link to the `signup` page on the index page of your app.

**src/routes/+page.svelte**

```html
<a href="/email">Send Test Email</a>
<a href="/signup">Sign Up With Email</a>
<hr />

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
```

### 4.1 Create a SvelteKit default form action for the Sign Up page

In the next steps you are going to add the code needed to create a new user in the database

All of this is done server-side in the **src/routes/signup/+page.server.ts** file.

Create a `+page.server.ts` file in the folder `src/routes/signup`.

<a href="https://kit.svelte.dev/docs/form-actions" target="_blank">https://kit.svelte.dev/docs/form-actions</a>

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const email = form_data.get('send_email');
		console.log(email);

		const password = form_data.get('send_password');
		console.log(password);

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
};
```

On the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> hit the submit button a few times.

You should have output similar to this in your terminal.

Your Ethereal email address obviously will be a the one you created in <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#13-create-an-ethereal-email-test-account" target="_blank">**1.3 Create an Ethereal email test account**</a>.

```bash
conner.white16@ethereal.email
0123456789876543210
conner.white16@ethereal.email
0123456789876543210
```

### 4.2 Do a basic check with the received form values

If the request couldn't be processed because of invalid data, you can return validation errors - along with the previously submitted form values - back to the user so that they can try again.

The `fail` function lets you return an HTTP status code (typically `400` or `422`, in the case of validation errors) along with the data.

<a href="https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors" target="_blank">https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors</a>

For validating an email address to have the correct format (not if it is valid or not!) have a look at this info.

<a href="https://lucia-auth.com/guidebook/email-verification-links/sveltekit#validating-emails" target="_blank">https://lucia-auth.com/guidebook/email-verification-links/sveltekit#validating-emails</a>

**src/routes/signup/+page.server.ts**

```ts
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

const isValidEmail = (maybeEmail: unknown): maybeEmail is string => {
	if (typeof maybeEmail !== 'string') return false;
	if (maybeEmail.length > 255) return false;
	const emailRegexp = /^.+@.+$/; // [one or more character]@[one or more character]
	return emailRegexp.test(maybeEmail);
};

export const actions: Actions = {
	default: async ({ request }) => {
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

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
};
```

### 4.3 Turn `isValidEmail` function into a module

Instead of having the `isValidEmail` function in the **src/routes/signup/+page.server.ts** file we can make a module out of it and hence make it available all over our codebase by just importing it.

Create a new file `email.ts` in the folder `src/lib/server`.

**src/lib/server/email.ts**

```ts
export const isValidEmail = (maybeEmail: unknown): maybeEmail is string => {
	if (typeof maybeEmail !== 'string') return false;
	if (maybeEmail.length > 255) return false;
	const emailRegexp = /^.+@.+$/; // [one or more character]@[one or more character]
	return emailRegexp.test(maybeEmail);
};
```

In the **src/routes/signup/+page.server.ts** now remove the `isValidEmail` function and import it from the module.

```ts
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/email';

export const actions: Actions = {
	default: async ({ request }) => {
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

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
};
```

### 4.4 Add new user to the database

After you have done a basic check with the received form values you can create a new user.

Users can be created with `Auth.createUser()`.

<a href="https://lucia-auth.com/basics/users" target="_blank">https://lucia-auth.com/basics/users</a>

This will create a new user, and, if `key` is defined, a new `key`.

<a href="https://lucia-auth.com/basics/keys" target="_blank">https://lucia-auth.com/basics/keys</a>

Keys represent the relationship between a user and a reference to that user.

While the user id is the primary way of identifying a user, there are other ways your app may reference a user during the authentication step such as by their `username`, `email`, or Github user id.

These identifiers, be it from a user input or an external source, are provided by a **provider**, identified by a `providerId`.

The unique id for that user within the provider is the `providerUserId`.

The unique combination of the provider id and provider user id makes up a `key`.

The `key` here defines the connection between the user and the provided unique `email` (`providerUserId`) when using the `email` & password authentication method (`providerId`).

We’ll also store the password in the `key`.

This `key` will be used to get the user and validate the password when logging them in.

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/email';
import { auth } from '$lib/server/lucia';

export const actions: Actions = {
	default: async ({ request }) => {
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
			// for now log the created user
			console.log(user);
		} catch (error) {
			console.log(error);
		}

		// for now you return the received form values back to the signup page
		return { timestamp: new Date(), email, password };
	}
} satisfies Actions;
```

Remember, you have can access the `attributes` inside `auth.createUser` because you defined them when initializing Lucia here <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#32-initialize-lucia" target="_blank">**3.2 Initialize Lucia**</a> and you can access their types because you defined the types here <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#33-set-up-types-for-lucia" target="_blank">**3.3. Set up types for Lucia**</a>.

**src/lib/server/lucia.ts**

```ts
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
	}
});

export type Auth = typeof auth;
```

**src/app.d.ts**

```ts
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// https://lucia-auth.com/getting-started/sveltekit#set-up-types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			// required Prisma Schema fields (i.e. id) should not be defined here
			email: string;
			email_verified: boolean;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
```
