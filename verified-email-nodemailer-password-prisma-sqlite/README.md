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

Note, when you close your browser or loose the current browser session you can get back to the email address you created with Ethereal by just signing in to your account.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_account_signin_with_details.png">

### 1.4 Store Ethereal email test account details in your private environment file

You are going to use the Ethereal account details throughout your app, so it makes sense to store the `Nodemailer configuration` details in your private environment file. Later when you start using a real email service you can just replace the configuration values in your environment file with the real values you obtain from the chosen email service.

<a href="https://kit.svelte.dev/docs/server-only-modules#private-environment-variables" target="_blank">https://kit.svelte.dev/docs/server-only-modules#private-environment-variables</a>

Like a good friend, SvelteKit keeps your secrets. When writing your backend and frontend in the same repository, it can be easy to accidentally import sensitive data into your front-end code (environment variables containing API keys, for example). SvelteKit provides a way to prevent this entirely: server-only modules.

Create a new file `.env` in the root folder.

**.env**

```bash
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT="587"
EMAIL_AUTH_USER="conner.white16@ethereal.email"
EMAIL_AUTH_PASS="MvPJdfrde3Uz8zewR6"
```

In any file that **executes logic only server-side** you can import them, such files are i.e. **`hooks.server.js`** or **`+page.server.js`** or **`hooks.server.ts`** or **`+page.server.ts`**.

```ts
import { EMAIL_HOST, EMAIL_PORT, EMAIL_AUTH_USER, EMAIL_AUTH_PASS } from '$env/static/private';
```

### 1.5 Send verification email with Nodemailer to your Ethereal email test account

Nodemailer has a nice example of how to send email.

<a href="https://nodemailer.com/about/#example" target="_blank">https://nodemailer.com/about/#example</a>

You are going to use that in the `+page.server.ts` file of the `email` page.

**src/routes/email/+page.server.ts**

```ts
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

For email verification you need a new Model `EmailToken`. That model should have an `id` field that will be the `token`, an `expires` field that will be the point in time when the token is not valid any more, and an `user_id` field that holds the id of the user for whom the token was generated.

In the `EmailToken` model, this is a Prisma **relation** and means that the field `user_id` from the `EmailToken` model has a relation with the field `id` of the `User` model.

With this relation you can link a specific token `token` to a specific `user`.

```prisma
 user    User   @relation(fields: [user_id], references: [id], onDelete: Cascade)
```

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
  user            User    @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  user           User   @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

model EmailToken {
  id      String @id @unique
  expires BigInt
  user_id String
  user    User   @relation(fields: [user_id], references: [id], onDelete: Cascade)

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
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT="587"
EMAIL_AUTH_USER="conner.white16@ethereal.email"
EMAIL_AUTH_PASS="MvPJdfrde3Uz8zewR6"

# This was inserted by `prisma init`:
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

**Lucia will be responsible to track this `User` object throughout your app.**

Note that it is only on this `User` object where you can set the status of the user's email address, that is, if it is verified or not.

For this you use the user attributes, `email` and `emailVerified`.

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

Set the types for the user attributes you added to the Lucia configuration, `email` and `email_verified`.

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

## 4.0 Create a User in the database

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

Note, I am populating the form input fields with the `email` address I get from Ethereal and a `password`.

**Email**

```html
<input type="text" name="send_email" id="send_email" value="conner.white16@ethereal.email" />
```

**Password**

```html
<input type="password" name="send_password" id="send_password" value="0123456789876543210" />
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

You should have output similar to this in your terminal..

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

### 4.4 Add a new User to the database

After you have done a basic check with the received form values you can create a new user.

Users can be created with `Auth.createUser()`.

<a href="https://lucia-auth.com/basics/users" target="_blank">https://lucia-auth.com/basics/users</a>

This will create a new user, and, if `key` is defined, a new `key`.

<a href="https://lucia-auth.com/basics/keys" target="_blank">https://lucia-auth.com/basics/keys</a>

Keys represent the relationship between a user and a reference to that user.

While the user id is the primary way of identifying a user, there are other ways your app may reference a user during the authentication step such as by their `username`, `email`, or Github user id.

These identifiers, be it from a user input or an external source, are provided by a **provider**, identified by a `providerId`.

The unique id for that user within the **provider** is the `providerUserId`.

The unique combination of the provider id and provider user id makes up a `key`.

The `key` here defines the connection between the user and the provided unique `email` (`providerUserId`) when using the `email` & `password` authentication method (`providerId`).

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

Let's create a new user and see what happens when you submit the form.

Start your development server.

`npm run dev`

`p dev`

Now also start Prisma Studio (in a new terminal), a visual interface for your database.

<a href="https://www.prisma.io/blog/prisma-studio-3rtf78dg99fe" target="_blank">https://www.prisma.io/blog/prisma-studio-3rtf78dg99fe</a>

Start Prisma Studio with this command.

<a href="https://www.prisma.io/blog/prisma-studio-3rtf78dg99fe#4-launch-prisma-studio-" target="_blank">https://www.prisma.io/blog/prisma-studio-3rtf78dg99fe#4-launch-prisma-studio-</a>

`npx prisma studio`

`px prisma studio`

Now go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

You should have output similar to this in your terminal..

```bash
  VITE v4.4.9  ready in 972 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
conner.white16@ethereal.email
0123456789876543210
{
  email: 'conner.white16@ethereal.email',
  emailVerified: false,
  userId: 'ly6xl4sb4rvboku'
}
```

On the `signup` page of your app you should have output similar to this..

```json
{
	"timestamp": "2023-09-14T06:39:41.839Z",
	"email": "conner.white16@ethereal.email",
	"password": "0123456789876543210"
}
```

Open the page with Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> to have a look at what happened in your database.

You should see a new `User` and a new `Key` in your database.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_new_user.png">

Click on `User` to see the `User` table.

You should see the `User` **id**, **email** and **email_verified** table for the newly created user.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_ new_user_details.png">

Well done, you just created a new user in your database. :tada:

### 4.5 Create a new Session for the new User

After successfully creating a new user, you will now create a new session with `Auth.createSession()` and store it in a cookie with `AuthRequest.setSession()`.

<a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession</a>

Sessions can be created with `Auth.createSession()` and can be stored in a cookie.

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth#createsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth#createsession</a>

```ts
const session = await auth.createSession({
	userId: user.userId,
	attributes: {}
});
locals.auth.setSession(session); // set session cookie
```

Note that you are accessing the `locals` object where you stored the `auth` methods when creating the `hooks.server.ts` file in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#34-set-up-hooks-to-store-authrequest-on-the-localsauth-object" target="_blank">**3.4 Set up hooks to store Auth.request() on the locals.auth object**</a>.

So to be able to access the `locals` object you need to add it as parameter to the default form action function.

You can unpack properties from objects passed as a function parameter. These properties may then be accessed within the function body.

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#unpacking_properties_from_objects_passed_as_a_function_parameter" target="_blank">MDN reference -> Unpacking properties from objects passed as a function parameter</a>

```ts
default: async ({ request, locals }) =>
```

This is what your `+page.server.ts` should look like now.

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/email';
import { auth } from '$lib/server/lucia';

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

#### 4.5.1 Delete newly created User

Go to Prisma Studio and now delete the newly created user.

<a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a>

Select the row with the user and hit `Delete 1 record`.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_delete_new_user.png">

Confirm to delete the record.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_confirm_delete_record.png">

#### 4.5.2 Create a new User and new Session for the User

After you have deleted the previously created `User` record to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form again.

Again, you should have output similar to this in your terminal..

```bash
conner.white16@ethereal.email
0123456789876543210
{
  email: 'conner.white16@ethereal.email',
  emailVerified: false,
  userId: 'fyqw1z4ejl5xbco'
}
```

Again, go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a>.

You should now see a new `User`, `Key` **and** `Session`.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_new_user_new_session.png">

Click on `Session` to see the newly created `Session` for the user.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_new_session_details.png">

Open your Development Tools in the browser, I am using Chrome.

Check out the `Application` tab and select `Storage -> Cookies`.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/chrome_dev_tools_application_storage_cookies.png">

Well done, you created a new `User` and a new `Session` in your database and created a `session cookie` in your app. :tada:

## 5.0 Generate Email Token

Once a user signs up to our app and supplies their email address during the sign up process an email with a verification link will be sent to that supplied email address.

This link could look something like this.

https://awesomeapp.example.com/email-verification/9846519846268798465235484632164684651354651321654846516465186325

The **token** is the part of this link that consists of a sequence of random numbers, in this particular verification link, 64 of them.

**9846519846268798465235484632164684651354651321654846516465186325**

During the sign up process this sequence of random numbers, the `token`, will also be stored in the database alongside other user data.
**Note that the token can also be a combination of random numbers and letters if you like**.

Once the user opens the email message and clicks on the verification link, the token will be available as query parameter of the page that does the verification.

<a href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" target="_blank">MDN reference -> query parameters</a>

If the token that is received as query parameter on the verification page is the same as the token that was created during sign up of the new user in the database, we can be sure that the user opened the email message and clicked on the verification link.

Hence the email address is verified and you can let the user access the protected routes/pages of your app.

Note that ideally there is also a certain amount of time the user has to check their email and click on the verification link in the email message sent to them.

If the user fails to click on the verification link within that amount of time the verification link should expire.

This amount of time could be the `token_expires_in_time`, it is up to you how much time you give the user before the verification link expires.

### 5.1 Generate new Token

Lucia has a few utility functions that we can use to generate tokens and check if the time for the verification link has expired.

<a href="https://lucia-auth.com/reference/lucia/modules/utils" target="_blank">https://lucia-auth.com/reference/lucia/modules/utils</a>

Let's use the utility function `generaterandomstring()` to generate a random string consisting of the numbers `0` - `9` and the letters `a` - `z`. The random string here has a length of 128 characters.

<a href="https://lucia-auth.com/reference/lucia/modules/utils#generaterandomstring" target="_blank">https://lucia-auth.com/reference/lucia/modules/utils#generaterandomstring</a>

```ts
// create a new token
const token = generateRandomString(128, '0123456789abcdefghijklmnopqrstuvwxyz');
console.log('token : ' + token);
```

Let's give the user a certain amount of time before the token expires. For this you take the current time and add the amount of time the user has to click the verification link to it. When this moment in time is reached the token will expire.

```ts
// create amount of time before the token expires
const token_expires_in_time = 1000 * 60 * 60 * 2;
console.log('token_expires_in_time : ' + token_expires_in_time); // => 7200000 milliseconds

// get the current time (UNIX) in milliseconds
const current_time_in_milliseconds = new Date().getTime();
console.log('current_time_in_milliseconds : ' + current_time_in_milliseconds);

// add up the current time and the time until the token expires
const token_expires_at_this_time = current_time_in_milliseconds + token_expires_in_time;
console.log('token_expires_at_this_time : ' + token_expires_at_this_time);
```

Now that you have the token, the current time and the expires in time, you add these values to the `EmailToken` model in the database with Prisma. The `id` on the `EmailToken` model is the `token`.

```ts
const emailToken = await prisma.emailToken.create({
	data: {
		id: token,
		expires: token_expires_at_this_time,
		user_id: user.userId
	}
});
```

Make sure that you also import the utility function `generaterandomstring()` from `lucia/utils` as well as the `PrismaClient` client from `@prisma/client`.

```ts
import { generateRandomString } from 'lucia/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

Add the code to your `+page.server.ts` file.

**src/routes/signup/+page.server.ts**

```ts
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
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

You should have output similar to this in your terminal..

```bash
conner.white16@ethereal.email
0123456789876543210
token : xx5jz7zvn8nl4u3a35drd56d73sb2e3xphe7lerz3nh12gwl27xnkpqbvm9ouicqoagz8mlfx00honubuduhhacepxav7aigfq4v4h18j83g6fogpinro4kpvjqnn700
token_expires_in_time : 7200000
current_time_in_milliseconds : 1694681830184
token_expires_at_this_time : 1694689030184
{
  id: 'xx5jz7zvn8nl4u3a35drd56d73sb2e3xphe7lerz3nh12gwl27xnkpqbvm9ouicqoagz8mlfx00honubuduhhacepxav7aigfq4v4h18j83g6fogpinro4kpvjqnn700',
  expires: 1694689030184n,
  user_id: 'zptpkjrggofepso'
}
{
  email: 'conner.white16@ethereal.email',
  emailVerified: false,
  userId: 'zptpkjrggofepso'
}
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a>.

You should see each of these Models, `User`, `Key`, `Session` and `EmailToken`, now having data from the newly created user.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_new_user_session_emailtoken.png">

Feel free to check out the created tables in Prisma Studio.

Have a look at the `EmailToken` Model.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_emailtoken_details.png">

You will see that the `user_id` field in the `EmailToken` model has the value as the `id` field in the `User` model.

This is because you created a **relation** between the `User` model and the `EmailToken` model when you created the schema for Prisma in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#24-set-up-prisma-schema-for-email-verification" target="_blank">**2.4 Set up Prisma Schema for email verification**</a>.

Well done, you created a new `User`, a new `Session` as well as a `token` for that `User` that `expires` at a certain point in time. :tada:

### 5.2 Turn `generateEmailVerificationToken` function into a module

Having all the logic to create a new token in the default form action for the `signup` page is not OK. As you will see later you are also going to need more logic related to creating and validating tokens. So let's turn the token generation into a module.

When you create a new user you are going to get an ` user.userId` for that user from the `auth.createUser()` method.

Since you are going to pass the `user.userId` to the `EmailToken` model when generating a new token for a new user you need to use that `user.userId` as a parameter for a function that deals with creating a new token for a new user.

```ts
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
```

At the end of this `generateEmailVerificationToken` function `return` the created token so it can be used in further logic in your default form action for the `signup` page.

Let's turn this function into a module now.

Create a new file `token.ts` in the folder `src/lib/server/token`.

Copy the function to that `token.ts` file and export it from the module.

<a href="https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export" target="_blank">MDN reference -> export</a>

Again, make sure that you also import the utility function `generaterandomstring()` from `lucia/utils` as well as the `PrismaClient` client from `@prisma/client`.

```ts
import { generateRandomString } from 'lucia/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

**src/lib/server/token.ts**

```ts
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
```

Now remove any logic that deals with generating a new token for a new user in the default fom action for the `signup` page and use the `token.ts` module instead.

Import the module at the top of the file and use the imported function inside the default form action of the `signup` page.

Note that the function `generateEmailVerification()` is declared as an asynchronous function because it deals with manipulating data in your database.

This means that the result of the function, the return value, is a **promise**.

```ts
return token;
```

In order to use the return value once it is **resolved** you have to **await** the return result.

Short, when calling the `generateEmailVerification()` function prefix it with the **await** keyword to be able to work with the resolved result, the `token`, of the function.

```ts
import { generateEmailVerificationToken } from '$lib/server/token';
...
try {
	...
	// create the token for the user
	const token = generateEmailVerificationToken(user.userId);
	console.log(token);
} catch (error) {
	...
}
```

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/email';
import { auth } from '$lib/server/lucia';
import { generateEmailVerificationToken } from '$lib/server/token';

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

## 6.0 Send Email with Verification Link to newly created User

Let's send the newly created user an email with the verification link.

Note that the created token for that user is of course part of the verification link.

### 6.1 Create `sendVerificationLink` module

Similar to the previous step, you are going to use a module for this functionality.

Create a new file `sendVerificationLink.ts` in folder `src/lib/server/message`.

**src/lib/server/message/sendVerificationLink.ts**

```ts
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
Hello ${to}, please open this verification link in your browser to verify your email address, thank you.
	
http://localhost:5173/verify/${token}

Awesome App Team
`;

	const html = `
Hello ${to},<br /><br />

please click this verification link to verify your email address, thank you.<br /><br />
	
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
```

### 6.2 Use `sendVerificationLink` module on the Sign up page

Now use this module in the `+page.server.ts` file of the `signup` page.

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/isValidEmail';
import { auth } from '$lib/server/lucia';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendVerificationMessage } from '$lib/server/message/sendVerificationLink';
import { verificationMessageTemplate } from '$lib/server/message/verificationMessageTemplate';

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

			// send the user an email message with a verification link
			const message = await sendVerificationMessage(email, token);
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
```

Now go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

You should have output similar to this in your terminal..

```bash
conner.white16@ethereal.email
0123456789876543210
token : i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd
token_expires_in_time : 7200000
current_time_in_milliseconds : 1694782519702
token_expires_at_this_time : 1694789719702
{
  id: 'i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd',
  expires: 1694789719702n,
  user_id: 'zedsn7uqc90yamd'
}
i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd
Message sent: <d831726f-3e04-8a71-3fc5-b969bd7723c7@ethereal.email>
{
  accepted: [ 'conner.white16@ethereal.email' ],
  rejected: [],
  ehlo: [ 'PIPELINING', '8BITMIME', 'SMTPUTF8', 'AUTH LOGIN PLAIN' ],
  envelopeTime: 114,
  messageTime: 136,
  messageSize: 1352,
  response: '250 Accepted [STATUS=new MSGID=ZQFaVM2l51sVUMSAZQRUOM.vdLF4Ss7gAAAAKsoBEzHGleEQjwpGqer701E]',
  envelope: {
    from: 'conner.white16@ethereal.email',
    to: [ 'conner.white16@ethereal.email' ]
  },
  messageId: '<d831726f-3e04-8a71-3fc5-b969bd7723c7@ethereal.email>'
}
{
  email: 'conner.white16@ethereal.email',
  emailVerified: false,
  userId: 'zedsn7uqc90yamd'
}
```

### 6.3 Check your Ethereal Messages to preview the Verification Email

Go to your Ethereal messages <a href="https://ethereal.email/messages" target="_blank">https://ethereal.email/messages</a> and click on the email you just sent.

**HTML**
<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_verification_message_details_html.png">

**Plaintext**
<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_verification_message_details_plaintext.png">

Well done, you

- created a new `User`,
- a new `Session`
- as well as a `token` for that `User`
- that `expires` at a certain point in time
- and you sent the `User` an email
- with a verification link
- to verify their email address.

:tada:

## 7.0 Validate Email Token

Now that a new user can sign up and in the process receives an email message with the verification link it is time to check the token in that verification link.

The verification link has this format.

```ts
http://localhost:5173/verify/${token}
```

Example verification link

```ts
http://localhost:5173/verify/i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd
```

So when the user clicks on that verification link in their email message they will land on a page in your app that has 3 parts to it.

**`http://localhost:5173`** the domain of your app + **`/verify`** a page of your app + **`/token`** another page of your app

So this means that you will need some sort of way to handle a request to such a route/page in your app.

In detail you will need

1. a route/page `/verify` that new users can be redirected to once they have signed up to your app
2. a route/page `/token` that will receive the token as part of the URL string / query parameter

### 7.1 Create a Verify page

Create a new file `+page.svelte` in the folder `src/routes/verify`.

**src/routes/verify/+page.svelte**

```html
<h1>Email verification</h1>
<p>Your email verification link was sent to your email address.</p>
```

This is it for now, you will come back to this page later.

### 7.2 Create a Token API route

This page is not a normal page where the user can see information displayed to them as if they would be browsing other pages of your app.

On this page no information is in fact shown to the user.

However you will need a way to access the string that is made up of the generated token in the verification link.

Note, you are redirecting the user to a page like this.

```ts
http://localhost:5173/verify/i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd
```

This means that you will need a way to access the part

`i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd`

of that link.

For this SvelteKit uses what is sometimes referred to as an **API route** or an **endpoint** or a **server endpoint**.

<a href="https://kit.svelte.dev/docs/routing#server" target="_blank">https://kit.svelte.dev/docs/routing#server</a>

However the part

`i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd`

of the verification link will always change since it will never be the same for any given user, this part of the link is **dynamic**.

To handle this case SvelteKit uses routes with **dynamic parameters**.

<a href="https://learn.svelte.dev/tutorial/params" target="_blank">https://learn.svelte.dev/tutorial/params</a>

This means that you will need to create a **server endpoint** with a **dynamic parameter**.

<a href="https://learn.svelte.dev/tutorial/get-handlers" target="_blank">https://learn.svelte.dev/tutorial/get-handlers</a>

SvelteKit allows you to create more than just pages. You can also create **API route** or an **endpoint** or a **server endpoint** by adding a `+server.ts` file that exports functions corresponding to HTTP methods: **GET**, **PUT**, **POST**, **PATCH** and **DELETE**.

<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" target="_blank">MDN reference -> HTTP methods</a>

Create a new file **`+server.ts`** in the folder `src/routes/verify/`**[token]**.

Take great care to note that the folder name has square brackets around it, **`[token]`** !

This means that any link to this route will be available to SvelteKit as a **dynamic parameter**.

The `+server.ts` file is also different to a normal `+page.server.ts` file.

These are important concepts to understand, so take great care here.

Let's start with a simple `+server.ts` file to see what is going on.

**src/routes/verify/[token]/+server.ts**

```ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
	// new Response(body, options)
	return new Response('abc123');
};
```

Visit this page of your app now <a href="http://localhost:5173/verify/token-string" target="_blank">http://localhost:5173/verify/token-string</a>.

You should see that the page returns the string `abc123`.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/server_endpoint_get_request.png">

Now let's see how you can get access to the token, the random string, in the verification link.

You know already that this part of the verification link is dynamic and to get this information from the link SvelteKit uses parameters.

<a href="https://kit.svelte.dev/docs/load#using-url-data" target="_blank">https://kit.svelte.dev/docs/load#using-url-data</a>

Often the load function depends on the URL in one way or another. For this, the load function provides you with `url`, `route` and `params`.

<a href="https://kit.svelte.dev/docs/load#using-url-data-params" target="_blank">https://kit.svelte.dev/docs/load#using-url-data-params</a>

Let's use `params` in the `GET` method for this **API route**.

**src/routes/verify/[token]/+server.ts**

```ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	console.log(params);

	const body = JSON.stringify(params);

	// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
	// new Response(body, options)
	return new Response(body);
};
```

Visit this page of your app now <a href="http://localhost:5173/verify/token-string" target="_blank">http://localhost:5173/verify/token-string</a>.

You should see that the page returns a key value pair in an object.

1. the key is the name of the parameter as defined by the variable of the folder name in square brackets, so src/routes/verify/**[token]**
2. the value is the value of that variable

So `params.token` is the value of the token in the `params` object.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/server_endpoint_get_request_params.png">

You should have this output in your terminal.

```bash
  VITE v4.4.9  ready in 901 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
{ token: 'token-string' }
```

Change the `token` part of the link to anything you like and check the output again.

For example visit this page of your app now <a href="http://localhost:5173/verify/12ab34cd" target="_blank">http://localhost:5173/verify/12ab34cd</a>.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/server_endpoint_get_request_params_token.png">

You should have this output in your terminal now.

```bash
  VITE v4.4.9  ready in 901 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
{ token: 'token-string' }
{ token: '12ab34cd' }
```

By using `params` in your `GET` method for this **API Route** you have access to the token string.

So when a user visits the verification link with the token your app has access to this random string.

Go to the verification link you sent to the previously signed up user, it is this link.

<a href="http://localhost:5173/verify/i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd" target="_blank">http://localhost:5173/verify/i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd</a>

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/server_endpoint_get_request_params_token_details.png">

You should have this output in your terminal now.

```bash
  VITE v4.4.9  ready in 901 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
{ token: 'token-string' }
{ token: '12ab34cd' }
{
  token: 'i3wtfh8s1obm9phc5bcyrlj2qdd0uzrvqs3idv28qewrrvuaem5ycug34vs6xljqpfdxcsgx0uphchp9tv4eogbeht7jbdzafhg5kml76n48sg3w2fzvf5uzhhh8vhjd'
}
```

### 7.3 Validate the token

Let's validate / check if the token provided through the verification link, the URL, belongs to an user that signed up to your app.

For this you query the `EmailToken` model and in it the field `id` for an entry that has the same value as the `parameter` you obtain from the `API route` that deals with the verification link.

So you get the token from the verification link and query / `findUnique()` your database, in it the `EmailToken` model where you pass that `token` to the field `id`.

```ts
const validateEmailVerificationToken = async (token: string) => {
	const userEmailToken = await prisma.emailToken.findUnique({
		where: {
			id: token
		}
	});
	// log the token from that user
	console.log(userEmailToken);
};
```

You can use the `token.ts` module for the function and export it from there to make it available in your app.

Add this code to the `token.ts` module.

**src/lib/server/token.ts**

```ts
import { generateRandomString } from 'lucia/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const generateEmailVerificationToken = async (userId: string) => {
	// create a new token
	...
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
```

Import this module in the `API route` for the verification link.

**src/routes/verify/[token]/+server.ts**

```ts
import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';

export const GET: RequestHandler = async ({ params }) => {
	console.log(params);

	// pass the token value that is available on the params object to the validateEmailVerificationToken function
	// the returned value is a promise, so you need to await the result
	const foundTokenUser = await validateEmailVerificationToken(params.token);
	console.log(foundTokenUser);

	const body = JSON.stringify(foundTokenUser?.user_id);

	// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
	// new Response(body, options)
	return new Response(body);
};
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

You should have output similar to this in your terminal..

```bash
conner.white16@ethereal.email
0123456789876543210
token : ksvsnr95i4gkszr61nfwmxvnv98jy77vo8t44darl3t6mtnrjocaoshg4c6or8f23vbigtf9se5dgk6ynn55pc7k5cdw48lj52z3zq6xxbd74omz2eqahkmh6xege4bf
token_expires_in_time : 7200000
current_time_in_milliseconds : 1694868088929
token_expires_at_this_time : 1694875288929
{
  id: 'ksvsnr95i4gkszr61nfwmxvnv98jy77vo8t44darl3t6mtnrjocaoshg4c6or8f23vbigtf9se5dgk6ynn55pc7k5cdw48lj52z3zq6xxbd74omz2eqahkmh6xege4bf',
  expires: 1694875288929n,
  user_id: 'cgxmgs08ej7i7xq'
}
ksvsnr95i4gkszr61nfwmxvnv98jy77vo8t44darl3t6mtnrjocaoshg4c6or8f23vbigtf9se5dgk6ynn55pc7k5cdw48lj52z3zq6xxbd74omz2eqahkmh6xege4bf
Message sent: <adcaf1b6-7b62-024d-dc06-112497b638b6@ethereal.email>
{
  accepted: [ 'conner.white16@ethereal.email' ],
  rejected: [],
  ehlo: [ 'PIPELINING', '8BITMIME', 'SMTPUTF8', 'AUTH LOGIN PLAIN' ],
  envelopeTime: 124,
  messageTime: 137,
  messageSize: 1348,
  response: '250 Accepted [STATUS=new MSGID=ZQFaVM2l51sVUMSAZQWiec.vdLF4S-Q.AAAALoJML7EcJDSX81a6j7JTjaQ]',
  envelope: {
    from: 'conner.white16@ethereal.email',
    to: [ 'conner.white16@ethereal.email' ]
  },
  messageId: '<adcaf1b6-7b62-024d-dc06-112497b638b6@ethereal.email>'
}
{
  email: 'conner.white16@ethereal.email',
  emailVerified: false,
  userId: 'cgxmgs08ej7i7xq'
}
```

Go to your Ethereal messages <a href="https://ethereal.email/messages" target="_blank">https://ethereal.email/messages</a> and click on the email you just sent.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/etherreal_verification_link_messages.png">

Click on the message.

**HTML**

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_verification_link_message_html_details.png">

**Plaintext**

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/ethereal_verification_link_message_plaintext_details.png">

Open the verification link in a new browser tab.

**If the token is valid you will obtain the id of the user that this token belongs to.**

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/verify_token_api_route_user_id.png">

You should have output similar to this in your terminal..

Note you are logging the `tokenUser` once in the `token.ts` module and the `foundTokenUser` once in the `+server.ts` **API Route** hence it is showing up twice in your terminal.

```bash
{
  token: 'ksvsnr95i4gkszr61nfwmxvnv98jy77vo8t44darl3t6mtnrjocaoshg4c6or8f23vbigtf9se5dgk6ynn55pc7k5cdw48lj52z3zq6xxbd74omz2eqahkmh6xege4bf'
}
{
  id: 'ksvsnr95i4gkszr61nfwmxvnv98jy77vo8t44darl3t6mtnrjocaoshg4c6or8f23vbigtf9se5dgk6ynn55pc7k5cdw48lj52z3zq6xxbd74omz2eqahkmh6xege4bf',
  expires: 1694875288929n,
  user_id: 'cgxmgs08ej7i7xq'
}
{
  id: 'ksvsnr95i4gkszr61nfwmxvnv98jy77vo8t44darl3t6mtnrjocaoshg4c6or8f23vbigtf9se5dgk6ynn55pc7k5cdw48lj52z3zq6xxbd74omz2eqahkmh6xege4bf',
  expires: 1694875288929n,
  user_id: 'cgxmgs08ej7i7xq'
}
```

Change the verification link in the browser tab by some characters and reload the page.

You should have output similar to this in your terminal..

```bash
{ token: 'ksvsnr95i' }
null
null
```

If the token cannot be found in the database you will receive a `null` value from the query. This means that no user with that token can be found.

### 7.4 Verify Email and Authenticate User

Now that the token is valid and you have a `user_id` as relation to the supplied `token` you can set the field `email_verified` of the `User` model to `true` for that same `user_id`.

If the token is valid you get a user id back as relation.
On that user id you can change the verified status of the email address.
The verification link was accessed from the email sent to that user, so the email address was verified.

However you are not using Prisma directly to change the values in the database.
Note that you like to track the user throughout your app with Lucia and ideally also set a valid Session for that user throughout your app once the email address is verified.

When you set up user management with Lucia you defined the user attributes `email` and `email_verified`.

To track the user throughout your app with Lucia and change the user attribute `email_verified` of that user do this.

**1. Get the user with Lucia.**

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth/#getuser" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth/#getuser</a>

```ts
const user = await auth.getUser(foundTokenUser?.user_id);
```

**2. Update the user attribute `email_verified` of that user with Lucia.**

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth/#updateuserattributes" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth/#updateuserattributes</a>

```ts
await auth.updateUserAttributes(user.userId, {
	email_verified: true // Number(true) if stored as an integer
});
```

**3. Invalidate all other possible Sessions of that user with Lucia.**

Note, when the user signs up you did create a Session for the user in the default form action of the `signup` page.

To have only one unique Session for any given user you need to invalidate all other Sessions of that user.

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidateallusersessions" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidateallusersessions</a>

```ts
await auth.invalidateAllUserSessions(user.userId);
```

**4. Set a new Session for that user with Lucia after you have updated the user attribute `email_verified`.**

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth/#createsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth/#createsession</a>

```ts
const session = await auth.createSession({
	userId: user.userId,
	attributes: {}
});
```

**5. Set a cookie that holds the new Session for that user with Lucia.**

<a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession</a>

Remember, when you create a new Session for a user like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#45-create-a-new-session-for-the-new-user" target="_blank">**4.5 Create a new Session for the new User**</a> you will access the `locals` object where you stored the `auth` methods when creating the `hooks.server.ts` file in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#34-set-up-hooks-to-store-authrequest-on-the-localsauth-object" target="_blank">**3.4 Set up hooks to store Auth.request() on the locals.auth object**</a>.

You can unpack properties from objects passed as a function parameter. These properties may then be accessed within the function body.

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#unpacking_properties_from_objects_passed_as_a_function_parameter" target="_blank">MDN reference -> Unpacking properties from objects passed as a function parameter</a>

So to be able to access the `locals` object you need to add it as parameter to the `GET` method of this token **API Route**.

Destructure `locals` from function parameter.

```ts
export const GET: RequestHandler = async ({ params, locals }) => { ...
```

Access `locals` object and any method on it, inside the `GET` function in the `+server.ts` file.

```ts
locals.auth.setSession(session);
```

**src/routes/verify/[token]/+server.ts**

```ts
import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ params, locals }) => {
	console.log(params);

	try {
		// pass the token value that is available on the params object to the validateEmailVerificationToken function
		// the returned value is a promise, so you need to await the result
		const foundTokenUser = await validateEmailVerificationToken(params.token);
		console.log(foundTokenUser);

		const foundTokenUser = await validateEmailVerificationToken(params.token);
		console.log(foundTokenUser);

		// check if a user with that token exists
		if (foundTokenUser) {
			// 1. Get the user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#getuser
			const user = await auth.getUser(foundTokenUser?.user_id);
			// 2. Update the user attribute
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#updateuserattributes
			await auth.updateUserAttributes(user.userId, {
				email_verified: true // Number(true) if stored as an integer
			});

			// 3. Invalidate all other possible Sessions of that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidateallusersessions
			await auth.invalidateAllUserSessions(user.userId);

			// 4. Set a new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#createsession
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// 5. Set a cookie that holds the new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession
			locals.auth.setSession(session);

			const body = JSON.stringify(foundTokenUser?.user_id);

			// https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
			// new Response(body, options)
			return new Response(body);
		}

		// if the user with that token cannot be found return an error message
		return new Response('invalid token');
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error));
	}
};
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

Open your browser Development Tools and have a look at the value of the Session cookie that was set.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/previous_session_cookie_value.png">

Now go to the new Ethereal message and open the new verification link in the same tab where you currently have the Development Tools open.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/current_session_cookie_value.png">

You can observe the value of the Session cookie has changed and a new Session was set for the user that now has a verified email address.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_new_user_new_session_email_verified_true.png">

If you reload this same tab with the verification link you can observe the Session cookie value keeps changing.

You now have a user with a valid Session, a session cookie set and their email address is verified.

However you are now still on the `/verify/[token]` page, the **API Route** and are returning the found user id.

Let's start thinking about user flow in your app..

## 8.0 Handle User Flow

Have a look at this simulated user flow, click through the various transitions and think about what this means for your app.

<a href="https://stately.ai/registry/editor/d8c54868-4dbd-4806-a2cd-bc1662671a07?machineId=680e35e2-094b-4757-ad97-79a7922b592f&mode=Simulate" target="_blank">Simulated User Flow</a>

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/user_flow.png">

You are now going to implement the various user flow scenarios.

### 8.1 New User wants to sign up with a new email address

Scenario User Flow

1. View App Home Page
2. User wants to sign up -> View Sign Up Page
3. User signs up for a new account with a new email address -> View Verify Email Page
4. User verifies their email address with the verification link -> View Profile Page
5. User logs out - > View App Home Page

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

At the moment, once you submit the form on the `signup` page you are leaving the user there.

#### 8.1.1 Redirect the new User to the Verify page

Let's redirect the user to the `verify` page after submitting the form on the `signup` page.

This happens in the default form action of the `signup` page, so go to your `+page.server.ts` file of the `signup` page and add the following code.

1. Import `redirect` from SvelteKit.
   <a href="https://kit.svelte.dev/docs/load#redirects" target="_blank">https://kit.svelte.dev/docs/load#redirects</a>

```ts
import { fail, redirect } from '@sveltejs/kit';
```

2. Redirect the user **after** the end of the `try catch` block.
3. In general, redirect users **after** the `try catch` block and **never inside** the `try catch` block !!
4. Make sure you **do not** `throw` **inside** a `try catch` block !!
   <img src="/verified-email-nodemailer-password-prisma-sqlite/docs/throw_redirect_try_catch_warning.png">
5. Use the HTTP status code `302` for this redirection.
   <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes" target="_blank">https://en.wikipedia.org/wiki/List_of_HTTP_status_codes</a>
   <a href="https://en.wikipedia.org/wiki/HTTP_302" target="_blank">https://en.wikipedia.org/wiki/HTTP_302</a>

```ts
redirect(302, '/verify');
```

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
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

			// send the user an email message with a verification link
			const message = await sendVerificationMessage(email, token);
			console.log(message);

			// for now log the created user
			console.log(user);
		} catch (error) {
			console.log(error);
		}

		// for now you return the received form values back to the signup page
		// return { timestamp: new Date(), email, password };

		// instead of returning the form values back to the user
		// you now redirect the signed up user to the "verify" page
		throw redirect(302, '/verify');
	}
} satisfies Actions;
```

#### 8.1.2 Facing a dead end after verification link is sent, breaking the user flow

Now that the user is on the `verify` page you have to wait for the user to paste the verification link in a browser tab.

Note, this can be in **another browser altogether** or **a new tab in the current browser** the user used to sign up.

So you are sort of facing a dead end on the `verify` page since you cannot make sure that the user pastes the verification link exactly in this tab in the same browser where this `verify` page is currently open.

If the user pastes the verification link in another tab while leaving the `verify` page open they will have to reload the `verify` page if they want to continue using your app in that tab.

Otherwise they will continue to use your app from the tab where they pasted in the verification link and just leave the `verify` page open or just close that tab.

This somewhat breaks the user flow..

You will come back to this scenario later and address is be implementing a form where the user can paste in their `token` received in an email message on the `verify` page itself.

Like this you create an incentive to ..

1. keep the user in the same browser
2. keep the user on the `verify` page in the same browser tab
3. have the user paste the `token` on the `verify` page and redirect them to their `profile` page right after that

For example GiiHub has you paste in a code in the same tab and browser where you are currently trying to log in..

For now, let's assume the user just pasted the verification link into the same tab where the `verify` page is open.

You previously took care to handle the token logic in these steps..

<a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#72-create-a-token-page" target="_blank">7.2. Create a token page</a>

<a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#73-validate-the-token" target="_blank">7.3. Validate the token</a>

<a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#74-verify-email-and-authenticate-user" target="_blank">7.4. Verify Email and Authenticate User</a>

However you are now still on the `/verify/[token]` page now, the **API Route** and are returning the found user id.

Let's redirect the user to their `profile` page and show them some personal user information.

#### 8.1.3 Create a Profile page

Create a `+page.svelte` file in the folder `src/routes/profile`. Export the `data` property on this page to show user specific data on this page.

```html
<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<a href="/">Home</a>
<hr />

<h1>Profile</h1>
<hr />

<h2>Account Details</h2>

<pre>{JSON.stringify(data, null, 2)}</pre>
```

#### 8.1.4 Redirect the new User with verified email address and authenticated session to Profile page

Remember, you are now still on the `/verify/[token]` page now, the **API Route** and are returning the found user id. The user just pasted the verification link from the email message in this browser tab.

Now you are going to redirect the user from this **API Route** to the `profile` page.

In **API routes** you cannot use SvelteKit's `redirect` function. Instead you use the `Response` object to redirect the user to the profile page.

**src/routes/verify/[token]/+server.ts**

```ts
import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ params, locals }) => {
	console.log(params);

	try {
		// pass the token value that is available on the params object to the validateEmailVerificationToken function
		// the returned value is a promise, so you need to await the result
		const foundTokenUser = await validateEmailVerificationToken(params.token);
		console.log(foundTokenUser);

		// check if a user with that token exists
		if (foundTokenUser) {
			// 1. Get the user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#getuser
			const user = await auth.getUser(foundTokenUser?.user_id);
			// 2. Update the user attribute
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#updateuserattributes
			await auth.updateUserAttributes(user.userId, {
				email_verified: true // Number(true) if stored as an integer
			});

			// 3. Invalidate all other possible Sessions of that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidateallusersessions
			await auth.invalidateAllUserSessions(user.userId);

			// 4. Set a new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#createsession
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// 5. Set a cookie that holds the new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession
			locals.auth.setSession(session);

			// you cannot use SvelteKit's redirect function in an API route
			// use the Response object to redirect the user to the profile page
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/profile'
				}
			});
		}

		// if the user with that token cannot be found return an error message
		return new Response('invalid token');
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error));
	}
};
```

#### 8.1.5 Load data for the Profile page

Note that you just verified this new user's email address, created a new Session for the user and set a session cookie in the browser with this user's session stored in it.

You now have a fully authenticated user and can show user details on the profile page.

Create a new file `+page.server.ts` in the folder `src/routes/profile`.

In the `load` function for this page you want to check for several cases.

1. if there is a session and if the session holds a user with a verified email address
2. if there is a session and the session DOES NOT not hold a user with a verified email address
3. all other cases

**src/routes/profile/+page.server.ts**

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	// 1. if there is a session and if the session holds a user with a verified email address
	if (session && session.user.emailVerified) {
		console.log(session);

		// return the user data stored on the session
		return {
			userId: session.user.userId,
			email: session.user.email
		};
	}
	// 2. if there is a session and the session DOES NOT not hold a user with a verified email address
	if (session && !session.user.emailVerified) {
		// redirect the user back to verify page
		throw redirect(302, '/verify');
	}
	// 3. redirect all other cases to the app index page for now
	throw redirect(302, '/');
};
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

On the `verify` page paste in the verification link.

If the verification link is correct you are redirected to the `profile` page.

You should have output similar to this in your terminal..

```bash
{
  user: {
    email: 'conner.white16@ethereal.email',
    emailVerified: true,
    userId: 's9t6qvo7mw43phc'
  },
  sessionId: '5nchxr3yokmc5nip60oj3a9975loptuspxrpaaw2',
  activePeriodExpiresAt: 2023-09-20T14:31:01.377Z,
  idlePeriodExpiresAt: 2023-10-04T14:31:01.377Z,
  state: 'active',
  fresh: false
}
```

Your `profile` page should show the personal user data, similar to this..

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/profile_page_details.png">

#### 8.1.6 Add additional session data for the User

For the sake of it, let's just quickly add some more session data for the user to show on the `profile` page.

You are going to show the exact date and time when the user has signed in to your app on the `profile` page.

For this you will need to..

1. change your Prisma Schema to include a `created_at` field in the `Session` model.

**prisma/schema.prisma**

```prisma
model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  created_at     BigInt // <== add a new field, created_at, as session attribute
  user           User   @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}
```

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
  user            User    @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  created_at     BigInt // <== add a new field, created_at, as session attribute
  user           User   @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}

model EmailToken {
  id      String @id @unique
  expires BigInt
  user_id String
  user    User   @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
}
```

2. add the new field as session attribute in your Lucia configuration
   <a href="https://lucia-auth.com/basics/configuration/#getsessionattributes" target="_blank">https://lucia-auth.com/basics/configuration/#getsessionattributes</a>

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
	},
	getSessionAttributes: (databaseSession) => {
		return {
			createdAt: databaseSession.created_at
		};
	}
});

export type Auth = typeof auth;
```

3. add the types for the new session attribute to your type configuration for Lucia

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
		// type DatabaseSessionAttributes = Record<string, never>;
		type DatabaseSessionAttributes = {
			created_at: number;
		};
	}
}

export {};
```

4. on the `signup` page, where the user has so far not finished signing in to your app set the `created_at` field value to the number 0

**src/routes/signup/+page.server.ts**

```ts
const session = await auth.createSession({
	userId: user.userId,
	attributes: {
		// set this field to 0 since the new user has so far not verified their email address and hence also not signed in to your app
		created_at: 0
	}
});
```

```ts
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
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
				attributes: {
					// set this field to 0 since the new user has so far not verified their email address and hence also not signed in to your app
					created_at: 0
				}
			});
			locals.auth.setSession(session); // set session cookie

			// create the token for the user
			const token = await generateEmailVerificationToken(user.userId);
			console.log(token);

			// send the user an email message with a verification link
			const message = await sendVerificationMessage(email, token);
			console.log(message);

			// for now log the created user
			console.log(user);
		} catch (error) {
			console.log(error);
		}

		// for now you return the received form values back to the signup page
		// return { timestamp: new Date(), email, password };

		// instead of returning the form values back to the user
		// you now redirect the signed up user to the "verify" page
		throw redirect(302, '/verify');
	}
} satisfies Actions;
```

5. when the user pastes the verification link with a valid token on the `verify` page (or on any other new tab, or in another browser) then you can add the current time as timestamp to the user's session

**src/routes/verify/[token]/+server.ts**

```ts
const session = await auth.createSession({
	userId: user.userId,
	attributes: {
		// here you can now set the current time, this is the timestamp where the verified user signed in to your app
		created_at: new Date().getTime()
	}
});
```

**src/routes/verify/[token]/+server.ts**

```ts
import type { RequestHandler } from './$types';
import { validateEmailVerificationToken } from '$lib/server/token';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ params, locals }) => {
	console.log(params);

	try {
		// pass the token value that is available on the params object to the validateEmailVerificationToken function
		// the returned value is a promise, so you need to await the result
		const foundTokenUser = await validateEmailVerificationToken(params.token);
		console.log(foundTokenUser);

		// check if a user with that token exists
		if (foundTokenUser) {
			// 1. Get the user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#getuser
			const user = await auth.getUser(foundTokenUser?.user_id);
			// 2. Update the user attribute
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#updateuserattributes
			await auth.updateUserAttributes(user.userId, {
				email_verified: true // Number(true) if stored as an integer
			});

			// 3. Invalidate all other possible Sessions of that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidateallusersessions
			await auth.invalidateAllUserSessions(user.userId);

			// 4. Set a new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#createsession
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {
					// here you can now set the current time, this is the timestamp where the verified user signed in to your app
					created_at: new Date().getTime()
				}
			});

			// 5. Set a cookie that holds the new Session for that user with Lucia
			// https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession
			locals.auth.setSession(session);

			// you cannot use SvelteKit's redirect function in an API route
			// use the Response object to redirect the user to the profile page
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/profile'
				}
			});
		}

		// if the user with that token cannot be found return an error message
		return new Response('invalid token');
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error));
	}
};
```

6. once the token is verified the user is redirected to the `profile` page, here the `load` function in the `+page.server.ts` file gets the user's data

Note, since the `created_at` field on the `Session` model is stored as `BigInt` in the database you cannot return the value as is from the session.

All data that is returned to a page has to be serialized but a `BigInt` cannot be serialized.

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json" target="_blank">MDN reference -> Use BigInt with JSON</a>

Due to this you simply wrap the `session.created_at` value in a `Number` and it works.

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number" target="_blank">MDN reference -> Number</a>

```ts
signedInAt: Number(session.createdAt);
```

**src/routes/profile/+page.server.ts**

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	// if there is a session and if the session holds a user with a verified email address
	if (session && session.user.emailVerified) {
		// check in the terminal to see what data the session holds
		console.log(session);

		// return the user data stored on the session
		return {
			userId: session.user.userId,
			email: session.user.email,
			signedInAt: Number(session.createdAt)
		};
	}
	// if there is a session and the session DOES NOT not hold a user with a verified email address
	if (session && !session.user.emailVerified) {
		// redirect the user back to verify page
		throw redirect(302, '/verify');
	}
	// redirect all other cases to the app index page for now
	throw redirect(302, '/');
};
```

7. last not least, change the `profile` page markup to show the exact date and time when the user has signed in to your app

**src/routes/profile/+page.svelte**

```html
<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<a href="/">Home</a>
<hr />

<h1>Profile</h1>
<hr />

<h2>Account Details</h2>

<pre>{JSON.stringify(data, null, 2)}</pre>

<p>Signed In At : {new Date(data.signedInAt)}</p>
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

On the `verify` page paste in the verification link.

If the verification link is correct you are redirected to the `profile` page.

You should have output similar to this in your terminal..

Note, you now have the additional `createdAt` value on your session.

```bash
{
  createdAt: 1695136682768n,
  user: {
    email: 'conner.white16@ethereal.email',
    emailVerified: true,
    userId: '01j5oj1piws4ycx'
  },
  sessionId: '6h7j7g88gebknexu643ernyzgb4y22yg18a9riw5',
  activePeriodExpiresAt: 2023-09-20T15:18:02.768Z,
  idlePeriodExpiresAt: 2023-10-04T15:18:02.768Z,
  state: 'active',
  fresh: false
}
```

Your `profile` page should show the personal user data, similar to this..

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/profile_page_created_at_field_user_details.png">

#### 8.1.7 Allow the User to Log Out on the Profile page

Last not least, once the user has signed up, verified their email and is authenticated and redirected to the `profile` page, you can provide a way for the user to log out from your app.

Add a form that will be handled by a default form action. There is no value that needs to be provided from the user.

**src/routes/profile/+page.svelte**

```html
<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<a href="/">Home</a>
<hr />

<h1>Profile</h1>
<hr />

<h2>Account Details</h2>

<pre>{JSON.stringify(data, null, 2)}</pre>

<p>Signed In At : {new Date(data.signedInAt)}</p>
<hr />

<form id="log_out" method="POST">
	<button form="log_out" type="submit">Log Out</button>
</form>

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

#### 8.1.8 Log out the User

Like you did before, handle the form submit with a default form action on the `profile` page.

To log out the user you need to..

1. check if there is a session, if there is no session return a `401` error
   <a href="https://en.wikipedia.org/wiki/HTTP_403" target="_blank">https://en.wikipedia.org/wiki/HTTP_403</a>

2. if there is a session invalidate the user's session
   <a href="https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidatesession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidatesession</a>

3. remove the cookie with the session
   <a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession</a>

4. redirect the user to the Home page of the app, or any other page that is NOT the profile page

**src/routes/profile/+page.server.ts**

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	// if there is a session and if the session holds a user with a verified email address
	if (session && session.user.emailVerified) {
		// check in the terminal to see what data the session holds
		console.log(session);

		// return the user data stored on the session
		return {
			userId: session.user.userId,
			email: session.user.email,
			signedInAt: Number(session.createdAt)
		};
	}
	// if there is a session and the session DOES NOT not hold a user with a verified email address
	if (session && !session.user.emailVerified) {
		// redirect the user back to verify page
		throw redirect(302, '/verify');
	}
	// redirect all other cases to the app index page for now
	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();

		// if there is no session then the user is forbidden to access this
		// https://en.wikipedia.org/wiki/HTTP_403
		if (!session) {
			return fail(401);
		}

		if (session) {
			// invalidate session
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#invalidatesession
			await auth.invalidateSession(session.sessionId);

			// remove cookie
			// https://lucia-auth.com/reference/lucia/interfaces/authrequest/#setsession
			locals.auth.setSession(null);

			// redirect to the app index page for now
			throw redirect(302, '/');
		}

		// redirect all other cases to the app index page for now
		throw redirect(302, '/');
	}
};
```

### 8.2 Existing User wants to log in with a verified email address

Scenario User Flow

1. View App Home Page
2. User wants to log in -> View Log In Page
3. User logs in with a verified email address -> View Profile Page
4. User logs out - > View App Home Page

#### 8.2.1 Create a Log In page

Create a new file `+page.svelte` in the folder `src/routes/login`.

```html
<a href="/">Home</a>
<hr />

<h1>Log In</h1>
<hr />

<h2>Log In With Email</h2>
<form id="log_in_with_email" method="POST">
	<label for="send_email">Email</label>
	<input type="text" name="send_email" id="send_email" value="conner.white16@ethereal.email" />
	<label for="send_password">Password</label>
	<input type="password" name="send_password" id="send_password" value="0123456789876543210" />
	<button form="log_in_with_email" type="submit">Submit</button>
</form>

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

#### 8.2.2 Link to Log In page from App Home page

Add a link to the `login` page.

**src/routes/+page.svelte**

```html
<a href="/email">Send Test Email</a>
<a href="/signup">Sign Up With Email</a>
<a href="/login">Log In With Email</a>
<hr />

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
```

#### 8.2.3 Find User with verified email address by Key and log them in

Similar to the default form action for the `signup` page you have a default form action for the `login` page in a `+page.server.ts` file.

Now on the `login` page the user supplies an `email` and a `password` value.

It is up to you to find a `user` in your database with those values.

This can be done with a `Key`.

**Keys represent the relationship between a user and a reference to that user.**

<a href="https://lucia-auth.com/basics/keys/" target="_blank">https://lucia-auth.com/basics/keys/</a>

<a href="https://lucia-auth.com/basics/keys/#email--password" target="_blank">https://lucia-auth.com/basics/keys/#email--password</a>

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth/#usekey" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth/#usekey</a>

<a href="https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit/#authenticate-users" target="_blank">https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit/#authenticate-users</a>

```ts
const keyUser = await auth.useKey('email', email.toLowerCase(), password);
```

While the user id is the primary way of identifying a user, there are other ways your app may reference a user during the authentication step such as by their `username`, `email`, or GitHub user id.

These identifiers, be it from a user input or an external source, are provided by a provider, identified by a provider id.

The unique id for that user within the provider is the provider user id.

The unique combination of the provider id and provider user id makes up a key.

Create a new file `+page.server.ts` in the folder `src/routes/login`.

**src/routes/login/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/isValidEmail';
import { auth } from '$lib/server/lucia';

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
			// find user by key and validate password
			// https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit/#authenticate-users
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#usekey
			// https://lucia-auth.com/basics/keys/#email--password
			const keyUser = await auth.useKey('email', email.toLowerCase(), password);

			const session = await auth.createSession({
				userId: keyUser.userId,
				attributes: {
					// here you can now set the current time, this is the timestamp where the verified user signed in to your app
					created_at: new Date().getTime()
				}
			});
			locals.auth.setSession(session); // set session cookie

			// for now log the logged in user
			console.log(keyUser);
		} catch (error) {
			console.log(error);
		}

		// you now redirect the logged in user to the "profile" page
		throw redirect(302, '/profile');
	}
} satisfies Actions;
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

On the `verify` page paste in the verification link.

If the verification link is correct you are redirected to the `profile` page.

On the `profile` page now log out the user.

You should be redirected to the app home page.

Now go to the `login` page and submit the form.

You should be redirected to the `profile` page.

You should have output similar to this in your terminal..

```bash
conner.white16@ethereal.email
0123456789876543210
{
  providerId: 'email',
  providerUserId: 'conner.white16@ethereal.email',
  userId: '3qyo1tcl0ve01vi',
  passwordDefined: true
}
{
  createdAt: 1695278311875n,
  user: {
    email: 'conner.white16@ethereal.email',
    emailVerified: true,
    userId: '3qyo1tcl0ve01vi'
  },
  sessionId: 'y6f2v0mcikxlbf47tcxuxc14g22sx6bao1h2buo8',
  activePeriodExpiresAt: 2023-09-22T06:38:31.875Z,
  idlePeriodExpiresAt: 2023-10-06T06:38:31.875Z,
  state: 'active',
  fresh: false
}
```

Your `profile` page should show the personal user data and a button to log out the user, similar to this..

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/profile_page_user_details_user_log_out_button.png">

When you hit the `Log Out` button the session will be removed and are redicted to the app home page.

### 8.3 Existing User wants to log in with an unverified email address

Scenario User Flow

1. View App Home Page
2. User wants to log in -> View Log In Page
3. User tries to log in with an unverified email address -> View Verify Page
4. User verifies their email address with the verification link -> View Profile Page
5. User logs out - > View App Home Page

#### 8.3.1 Redirect user with load function after form action has completed

Remember, in <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#815-load-data-for-the-profile-page" target="_blank">**8.1.5 Load data for the Profile page**</a> you have this code in the `load` function for the `profile` page that redirects the user to the `verify` page if their email address is not verified.

**src/routes/profile/+page.server.ts**

```ts
// 2. if there is a session and the session DOES NOT not hold a user with a verified email address
if (session && !session.user.emailVerified) {
	// redirect the user back to verify page
	throw redirect(302, '/verify');
}
```

Also, so far, at the end of the default form action of the `login` page you redirect the user to the `profile` page.

**src/routes/login/+page.server.ts**

```ts
// you now redirect the logged in user to the "profile" page
throw redirect(302, '/profile');
```

There is one very important bit of information to understand and use when dealing with form actions.

**<a href="https://kit.svelte.dev/docs/form-actions#loading-data" target="_blank">https://kit.svelte.dev/docs/form-actions#loading-data</a>**

_After a form action runs, the page will be re-rendered (unless a redirect or an unexpected error occurs), with the action's return value available to the page as the form prop. This means that your page's load functions will run after the action completes._

In other words, if you do not redirect at the end of a `try catch` block of a form action the page's `load` function will run again.

This means that you can, depending on what logic you have running in the form action, take care of different conditions in the `load` function after they happened in the form action.

If you were to **not** redirect a user to the `profile` page at the end of the form action you have all the freedom to decide what you want to do next with the user.

Let's get rid of the redirect to the `profile` page at the end of the default from action of the profile page.

Simply comment out that line.

**src/routes/login/+page.server.ts**

```ts
// you now redirect the logged in user to the "profile" page
// if you do not redirect after the form action the load function of the page will run
// throw redirect(302, '/profile');
```

Now since you are not redirecting the user to the `profile` page after they have signed up you use a `load` function to do exactly that. And yes, you can use a `load` function because this `load` function will run **AFTER** the default form action has completed running.

At the top of the file **src/routes/login/+page.server.ts** add a `load` function.

```ts
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('LOGIN page load function logs session : ' + JSON.stringify(session?.user));

	// if there is a session but the user's email address is not verified
	if (session && !session.user.emailVerified) {
		// redirect the user to the verify page
		throw redirect(302, '/verify');
	}
	// if there is a session and the user's email address in verified
	if (session && session?.user.emailVerified) {
		// redirect the user to the profile page
		throw redirect(302, '/profile');
	}
};
```

Since we are dealing with a user whose email address is not yet verified in this user flow scenario we can now add the needed logic inside the default form action of the `login` page.

```ts
// if there is a session but the user's email address is not verified
if (session && !session.user.emailVerified) {
	// create the token for the user
	const token = await generateEmailVerificationToken(session.user.userId);
	console.log(token);

	// send the user an email message with a verification link
	const message = await sendVerificationMessage(session.user.email, token);
	console.log(message);
}
```

Everything together your `+page.server.ts` file for the `login` page now has this code.

**src/routes/login/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail } from '$lib/server/isValidEmail';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendVerificationMessage } from '$lib/server/message/sendVerificationLink';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('LOGIN page load function logs session : ' + JSON.stringify(session?.user));

	// if there is a session but the user's email address is not verified
	if (session && !session.user.emailVerified) {
		// redirect the user to the verify page
		throw redirect(302, '/verify');
	}
	// if there is a session and the user's email address in verified
	if (session && session?.user.emailVerified) {
		// redirect the user to the profile page
		throw redirect(302, '/profile');
	}
};

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
			// find user by key and validate password
			// https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit/#authenticate-users
			// https://lucia-auth.com/reference/lucia/interfaces/auth/#usekey
			// https://lucia-auth.com/basics/keys/#email--password
			const keyUser = await auth.useKey('email', email.toLowerCase(), password);

			const session = await auth.createSession({
				userId: keyUser.userId,
				attributes: {
					// here you can now set the current time, this is the timestamp where the verified user signed in to your app
					created_at: new Date().getTime()
				}
			});
			locals.auth.setSession(session); // set session cookie

			// if there is a session but the user's email address is not verified
			if (session && !session.user.emailVerified) {
				// create the token for the user
				const token = await generateEmailVerificationToken(session.user.userId);
				console.log(token);

				// send the user an email message with a verification link
				const message = await sendVerificationMessage(session.user.email, token);
				console.log(message);
			}

			// for now log the logged in user
			console.log(keyUser);
		} catch (error) {
			console.log(error);
		}

		// you now redirect the logged in user to the "profile" page
		// if you do not redirect after the form action the load function of the page will run
		// throw redirect(302, '/profile');
	}
} satisfies Actions;
```

If the user has a verified email address they are being redirected to the `profile` page without a new verification link being sent to them.

**However** if the user's email address is not verified and they log in they will indeed receive a new verification link and be redirected to the `verify` page.

The good thing about this is, that only when the user signs in with a correct `email` and `password` but does not yet have a verified email address will a verification link be re-sent to them.

Another approach would be to have a button on the `verfiy` page that the user could use to have the verification link be resent to them.

<a href="https://lucia-auth.com/guidebook/email-verification-links/sveltekit/#resend-verification-link" target="_blank">https://lucia-auth.com/guidebook/email-verification-links/sveltekit/#resend-verification-link</a>

However with this approach a user could abuse this feature and keep pressing the button "resend verifiaction link" and send an indefinite amount of verification links to an email address that might not be their own.

By coupling the login process with the conditional check for the user's verified email address and only then sending a verification link it is made slightly harder to have an indefinite number of verification links being sent.

This together with implementing login throttling the sending of verification links can be kept to a minimum. More about login throttling later..

To see exactly what is going on and how the user flows through your app add a few log functions to the `+page.server.ts` files of the `login` page, the `profile` page and the `verify` page.

**src/routes/login/+page.server.ts**

```ts
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('LOGIN page load function logs session : ' + JSON.stringify(session?.user));
	...
```

**src/routes/profile/+page.server.ts**

```ts
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('PROFILE page load function logs session : ' + JSON.stringify(session?.user));
	...
```

**src/routes/verify/+page.server.ts**

```ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('VERIFY page load function logs session : ' + JSON.stringify(session?.user));
	return {};
};
```

Go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and delete the previously created `User` record like you did in this step <a href="https://github.com/robots4life/luscious-lucia/tree/master/verified-email-nodemailer-password-prisma-sqlite/#451-delete-newly-created-user" target="_blank">**4.5.1 Delete newly created User**</a>.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit the form.

On the `verify` page paste in the verification link.

If the verification link is correct you are redirected to the `profile` page.

On the `profile` page now log out the user.

You should be redirected to the app home page.

Now go to the `login` page and submit the form.

You should be redirected to the `profile` page.

Now log out the user, you should be redirected to the app home page.

Clear any browser cache you might have, note, there should be no session cookie stored any more after you have logged out the user.

Now go to Prisma Studio <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and open the `User` table.

In the row `email_verified` double click on the value `true`.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_user_select_email_verified_true.png">

Select the value `false` and confirm your choice, click on `Save 1 change`.

<img src="/verified-email-nodemailer-password-prisma-sqlite/docs/prisma_studio_user_email_verified_false.png">

Now go to the `login` page and submit the form.

You should be redirected to the `verify` page.

You should have output similar to this in your terminal..

```bash
VERIFY page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":false,"userId":"3qyo1tcl0ve01vi"}
LOGIN page load function logs session : undefined
conner.white16@ethereal.email
0123456789876543210
token : x47bwxtejbny4nmqwvf6zt0teqqv69fhktd9kz258zy6sdtj2u1mwgwbtv87dmjzugai1un48w0aq6vq2voeb27fwzma1f0vzbnqpmiycb62v0fgjqhd9qtfidhkk1do
token_expires_in_time : 7200000
current_time_in_milliseconds : 1695293871817
token_expires_at_this_time : 1695301071817
{
  id: 'x47bwxtejbny4nmqwvf6zt0teqqv69fhktd9kz258zy6sdtj2u1mwgwbtv87dmjzugai1un48w0aq6vq2voeb27fwzma1f0vzbnqpmiycb62v0fgjqhd9qtfidhkk1do',
  expires: 1695301071817n,
  user_id: '3qyo1tcl0ve01vi'
}
x47bwxtejbny4nmqwvf6zt0teqqv69fhktd9kz258zy6sdtj2u1mwgwbtv87dmjzugai1un48w0aq6vq2voeb27fwzma1f0vzbnqpmiycb62v0fgjqhd9qtfidhkk1do
Message sent: <7c30e559-d167-4cf6-0275-e9cbe4acae7e@ethereal.email>
{
  accepted: [ 'conner.white16@ethereal.email' ],
  rejected: [],
  ehlo: [ 'PIPELINING', '8BITMIME', 'SMTPUTF8', 'AUTH LOGIN PLAIN' ],
  envelopeTime: 128,
  messageTime: 136,
  messageSize: 1342,
  response: '250 Accepted [STATUS=new MSGID=ZQFaVM2l51sVUMSAZQwhsLf8ObJ5Fxl6AAAAp9-emo5uvc12Yl-mZss-P.4]',
  envelope: {
    from: 'conner.white16@ethereal.email',
    to: [ 'conner.white16@ethereal.email' ]
  },
  messageId: '<7c30e559-d167-4cf6-0275-e9cbe4acae7e@ethereal.email>'
}
{
  providerId: 'email',
  providerUserId: 'conner.white16@ethereal.email',
  userId: '3qyo1tcl0ve01vi',
  passwordDefined: true
}
LOGIN page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":false,"userId":"3qyo1tcl0ve01vi"}
VERIFY page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":false,"userId":"3qyo1tcl0ve01vi"}
```

Go to your Ethereal messages and get the latest verification link you just sent during the default form action of the `login` page.

On the `verify` page paste in the verification link.

If the verification link is correct you are redirected to the `profile` page.

You should have output similar to this in your terminal..

```bash
{
  token: 'x47bwxtejbny4nmqwvf6zt0teqqv69fhktd9kz258zy6sdtj2u1mwgwbtv87dmjzugai1un48w0aq6vq2voeb27fwzma1f0vzbnqpmiycb62v0fgjqhd9qtfidhkk1do'
}
{
  id: 'x47bwxtejbny4nmqwvf6zt0teqqv69fhktd9kz258zy6sdtj2u1mwgwbtv87dmjzugai1un48w0aq6vq2voeb27fwzma1f0vzbnqpmiycb62v0fgjqhd9qtfidhkk1do',
  expires: 1695301071817n,
  user_id: '3qyo1tcl0ve01vi'
}
{
  id: 'x47bwxtejbny4nmqwvf6zt0teqqv69fhktd9kz258zy6sdtj2u1mwgwbtv87dmjzugai1un48w0aq6vq2voeb27fwzma1f0vzbnqpmiycb62v0fgjqhd9qtfidhkk1do',
  expires: 1695301071817n,
  user_id: '3qyo1tcl0ve01vi'
}
PROFILE page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":true,"userId":"3qyo1tcl0ve01vi"}
{
  createdAt: 1695293979913n,
  user: {
    email: 'conner.white16@ethereal.email',
    emailVerified: true,
    userId: '3qyo1tcl0ve01vi'
  },
  sessionId: '6kseoaa906n2mwohs2rfp2r8z7mu0vj1iwf1c55q',
  activePeriodExpiresAt: 2023-09-22T10:59:39.913Z,
  idlePeriodExpiresAt: 2023-10-06T10:59:39.913Z,
  state: 'active',
  fresh: false
}
```

You can now log out the user to be redirected to the app home page.

Take great care to see how the user flows through your app on the different pages and how the `emailVerified` status changes.

```bash
1. login
VERIFY page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":false,"userId":"3qyo1tcl0ve01vi"}
LOGIN page load function logs session : undefined

2. redirected to verify page
LOGIN page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":false,"userId":"3qyo1tcl0ve01vi"}
VERIFY page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":false,"userId":"3qyo1tcl0ve01vi"}

3. pasted in the verification link and redirected to profile page
PROFILE page load function logs session : {"email":"conner.white16@ethereal.email","emailVerified":true,"userId":"3qyo1tcl0ve01vi"}
```

### 8.4 Existing User wants to sign up in with an email address that is already used for an account

Scenario User Flow

1. View App Home Page
2. User wants to sign up -> View Sign Up Page
3. User signs up for a new account with an email address that is already used for an account -> View Warning Message
4. User wants to log in -> View Log In Page

5.1 User logs in with a verified email address -> View Profile Page

5.2 User tries to log in with an unverified email address -> View Verify Page

5.3 User verifies their email address with the verification link -> View Profile Page

6. User logs out - > View App Home Page

#### 8.4.1 Display warning on Sign Up page if user tries to sign up with an email address that already exists
