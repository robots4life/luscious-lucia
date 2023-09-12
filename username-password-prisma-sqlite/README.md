<img src="/username-password-prisma-sqlite/docs/lucia.png">

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

- [1.0 Getting Started in SvelteKit](#10-getting-started-in-sveltekit)
  - [1.1 Initialize Lucia](#11-initialize-lucia)
  - [1.2 Setup your database](#12-setup-your-database)
    - [1.2.1 Prisma adapter](#121-prisma-adapter)
    - [1.2.2 Add Prisma to SvelteKit](#122-add-prisma-to-sveltekit)
    - [1.2.3 Set up Prisma](#123-set-up-prisma)
    - [1.2.4 Set up Prisma schema](#124-set-up-prisma-schema)
    - [1.2.5 Install Lucia database adapter Prisma](#125-install-lucia-database-adapter-prisma)
    - [1.2.6 Add default values to lucia.ts](#126-add-default-values-to-luciats)
  - [1.3 Set up types](#13-set-up-types)
  - [1.4 Set up hooks](#14-set-up-hooks)
- [2.0 Sign in with username and password using adapter Prisma and Sqlite](#20-sign-in-with-username-and-password-using-adapter-prisma-and-sqlite)
  - [2.1 Update your database](#21-update-your-database)
  - [2.2 Update your types](#22-update-your-types)
  - [2.3 Configure Lucia](#23-configure-lucia)
- [3.0 Create a Sign up page](#30-create-a-sign-up-page)
- [4.0 Create users in the database](#40-create-users-in-the-database)
  - [4.1 Learn about SvelteKit form actions](#41-learn-about-sveltekit-form-actions)
  - [4.2 Create a form action for the signup page](#42-create-a-form-action-for-the-sign-up-page)
    - [4.2.1 Do a basic check for the received form values](#421-do-a-basic-check-for-the-received-form-values)
    - [4.2.2 Use `auth.createUser` from Lucia](#422-use--authcreateuser--from-lucia)
    - [4.2.3 Use `auth.createSession()` and `auth.setSession()` from Lucia](#423-use--authcreatesession----and--authsetsession----from-lucia)
    - [4.2.4 Handle errors](#424-handle-errors)
    - [4.2.5 Handle case sensitive user input](#425-handle-case-sensitive-user-input)
- [5.0 Redirect authenticated users](#50-redirect-authenticated-users)
  - [5.1 Create a Profile page](#51-create-a-profile-page)
  - [5.2 Create a Log in page](#52-create-a-log-in-page)
  - [5.3 Add a link to the Profile page](#53-add-a-link-to-the-profile-page)
- [6.0 Sign out users](#60-sign-out-users)
  - [6.1 Sign out users with a SvelteKit named form action](#61-sign-out-users-with-a-sveltekit-named-form-action)

## 1.0 Getting Started in SvelteKit

<a href="https://lucia-auth.com/getting-started/sveltekit" target="_blank">https://lucia-auth.com/getting-started/sveltekit</a>

Install Lucia using the package manager of your choice.

`pa lucia`

### 1.1 Initialize Lucia

<a href="https://lucia-auth.com/getting-started/sveltekit#initialize-lucia" target="_blank">https://lucia-auth.com/getting-started/sveltekit#initialize-lucia</a>

Import `lucia()` from `lucia` and initialize it in its own module (file). Export `auth` and its type as `Auth`. Make sure to pass the `sveltekit()` middleware. We also need to provide an adapter but since it’ll be specific to the database you’re using, we’ll cover that in the next section.

**src/lib/server/lucia.ts**

```ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';

// expect error (see next section)
export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit()
});

export type Auth = typeof auth;
```

### 1.2 Setup your database

<a href="https://lucia-auth.com/getting-started/sveltekit#setup-your-database" target="_blank">https://lucia-auth.com/getting-started/sveltekit#setup-your-database</a>

Lucia uses adapters to connect to your database. We provide official adapters for a wide range of database options, but you can always create your own. The schema and usage are described in each adapter’s documentation. The example below is for the **Prisma adapter**.

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
	adapter: prisma(client)
});

export type Auth = typeof auth;
```

#### 1.2.1 Prisma adapter

<a href="https://lucia-auth.com/database-adapters/prisma" target="_blank">https://lucia-auth.com/database-adapters/prisma</a>

#### 1.2.2 Add Prisma to SvelteKit

Add the Prisma extension to VS Code.

Extension id `Prisma.prisma`

<a href="https://marketplace.visualstudio.com/items?itemName=Prisma.prisma" target="_blank">https://marketplace.visualstudio.com/items?itemName=Prisma.prisma</a>

Add the settings for the Prisma extension in your `settings.json`.

```json
"[prisma]": {
  "editor.defaultFormatter": "Prisma.prisma",
  "editor.formatOnSave": true
},
```

Install the Prisma CLI as a development dependency in the project.

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#installation" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#installation</a>

<a href="https://pnpm.io/cli/install#--dev--d" target="_blank">https://pnpm.io/cli/install#--dev--d</a>

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#pnpm" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#pnpm</a>

`pi prisma -D`

```bash
Packages: +2
++
Progress: resolved 246, reused 222, downloaded 2, added 2, done
node_modules/.pnpm/@prisma+engines@5.2.0/node_modules/@prisma/engines: Running postinstall script, done in 398ms
node_modules/.pnpm/prisma@5.2.0/node_modules/prisma: Running preinstall script, done in 70ms

devDependencies:
+ prisma 5.2.0

Done in 9.5s
```

#### 1.2.3 Set up Prisma

Set up Prisma with the `init` command of the Prisma CLI and choose `sqlite` as database.

<a href="https://www.prisma.io/docs/reference/api-reference/command-reference#pnpm-1" target="_blank">https://www.prisma.io/docs/reference/api-reference/command-reference#pnpm-1</a>

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
https://pris.ly/d/getting-started
```

#### 1.2.4 Set up Prisma schema

<a href="https://lucia-auth.com/database-adapters/prisma#prisma-schema" target="_blank">https://lucia-auth.com/database-adapters/prisma#prisma-schema</a>

Add Prisma schema for default Lucia values.

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
  id           String    @id @unique
  auth_session Session[]
  key          Key[]
}

model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  user           User   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
}

model Key {
  id              String  @id @unique
  hashed_password String?
  user_id         String
  user            User    @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
}
```

#### 1.2.5 Install Lucia database adapter Prisma

<a href="https://lucia-auth.com/database-adapters/prisma#installation" target="_blank">https://lucia-auth.com/database-adapters/prisma#installation</a>

`pa @lucia-auth/adapter-prisma`

```bash
Packages: +3
+++
Progress: resolved 249, reused 227, downloaded 0, added 3, done
node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client: Running postinstall script, done in 2.5s

dependencies:
+ @lucia-auth/adapter-prisma 3.0.1

Done in 5.2s
```

#### 1.2.6 Add default values to lucia.ts

<a href="https://lucia-auth.com/database-adapters/prisma#usage" target="_blank">https://lucia-auth.com/database-adapters/prisma#usage</a>

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
	})
});

export type Auth = typeof auth;
```

### 1.3 Set up types

<a href="https://lucia-auth.com/getting-started/sveltekit#set-up-types" target="_blank">https://lucia-auth.com/getting-started/sveltekit#set-up-types</a>

**src/app.d.ts**

In your `src/app.d.ts` file, declare a `Lucia` namespace. The import path for `Auth` is where you initialized `lucia()`.

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
		type DatabaseUserAttributes = {};
		type DatabaseSessionAttributes = {};
	}
}

export {};
```

### 1.4 Set up hooks

<a href="https://lucia-auth.com/getting-started/sveltekit#set-up-hooks" target="_blank">https://lucia-auth.com/getting-started/sveltekit#set-up-hooks</a>

This is optional but highly recommended. Create a new `handle()` hook that stores `AuthRequest` to `locals.auth`.

**src/hooks.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};
```

## 2.0 Sign in with username and password using adapter Prisma and Sqlite

<a href="https://lucia-auth.com/basics/database#database-model" target="_blank">https://lucia-auth.com/basics/database#database-model</a>

Lucia requires 3 tables to work, which are then connected to Lucia via a database adapter.

**User** table <a href="https://lucia-auth.com/basics/database#user-table" target="_blank">https://lucia-auth.com/basics/database#user-table</a>
**Session** table <a href="https://lucia-auth.com/basics/database#session-table" target="_blank">https://lucia-auth.com/basics/database#session-table</a>
**Key** table <a href="https://lucia-auth.com/basics/database#key-table" target="_blank">https://lucia-auth.com/basics/database#key-table</a>

### 2.1 Update your database

To sign in with a **username** we need to add an `username` field to the `User` table.

<a href="https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#update-your-database" target="_blank">https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#update-your-database</a>

**prisma/schema.prisma**

```ts
model User {
  id           String    @id @unique
  username     String    @unique	<== add the username field to the User model
  auth_session Session[]
  key          Key[]
}
```

### 2.2 Update your types

Declare the type of each field you add in the `Lucia.DatabaseUserAttributes`.

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
			// required fields (i.e. id) should not be defined here
			username: string;		<== add the username type to the DatabaseUserAttributes type
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
```

At this point, you have a Prisma schema but no database yet!!

<a href="https://www.prisma.io/docs/getting-started/quickstart#3-run-a-migration-to-create-your-database-tables-with-prisma-migrate" target="_blank">https://www.prisma.io/docs/getting-started/quickstart#3-run-a-migration-to-create-your-database-tables-with-prisma-migrate</a>

Run the following command in your terminal to create the SQLite database and the **User**, **Key** and **Session** tables represented by your models defined in <a href="https://github.com/robots4life/luscious-lucia#124-set-up-prisma-schema" target="_blank">**1.2.4 Set up Prisma schema**</a> and updated in <a href="https://github.com/robots4life/luscious-lucia#21-update-your-database" target="_blank">**2.1 Update your database**</a>.

`px prisma migrate dev --name init`

This command did two things.

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

Applying migration `20230909155247_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230909155247_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.2.0) to ./node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client in 117ms
```

**.env**

```bash
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```

### 2.3 Configure Lucia

We’ll expose the user’s `username` to the `User` object by defining `getUserAttributes`.

<a href="https://lucia-auth.com/basics/configuration#getuserattributes" target="_blank">https://lucia-auth.com/basics/configuration#getuserattributes</a>

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
	// Generate user attributes for the user.
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

export type Auth = typeof auth;
```

## 3.0 Create a Sign up page

To create users we need a form that sends `username` and `password` values to our database.

Create a `signup` route.

**src/routes/signup/+page.svelte**

```html
<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<input type="submit" />
</form>

<a href="/">Home</a>
```

Link to the `signup` route from the `index` page.

**src/routes/+page.svelte**

```html
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<a href="/signup">Sign up</a>
```

## 4.0 Create users in the database

<a href="https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#create-users" target="_blank">https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#create-users</a>

### 4.1 Learn about SvelteKit form actions

Example from the SvelteKit docs.

<a href="https://kit.svelte.dev/docs/form-actions" target="_blank">https://kit.svelte.dev/docs/form-actions</a>

In the simplest case, a page declares a `default action`.

**src/routes/signup/+page.server.ts**

```ts
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		// CREATE the user with the supplied form data
	}
} satisfies Actions;
```

To invoke this action from the `signup` page, just add a `<form>` - no JavaScript needed.

**src/routes/signup/+page.svelte**

```html
<form method="POST">
	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Sign up</button>
</form>
```

### 4.2 Create a form action for the Sign up page

**routes/signup/+page.server.ts**

```ts
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		//
		// CREATE the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);
	}
} satisfies Actions;
```

Start the development server.

`p dev`

Go to the <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> page.

Fill the form with `Jane` for username and `icecream` for password and click the `Submit` button.

Check the terminal in VS Code. You should see the data sent to the server in the terminal.

```bash
vite dev

  VITE v4.4.9  ready in 915 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
username : Jane
password : icecream
```

#### 4.2.1 Do a basic check for the received form values

<a href="https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors" target="_blank">https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors</a>

If the request couldn't be processed because of invalid data, you can return validation errors - along with the previously submitted form values - back to the user so that they can try again.

The `fail` function lets you return an HTTP status code (typically 400 or 422, in the case of validation errors) along with the data.

```ts
import { fail } from '@sveltejs/kit';

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
```

#### 4.2.2 Use `auth.createUser` from Lucia

Users can be created with `Auth.createUser()`.

<a href="https://lucia-auth.com/basics/users" target="_blank">https://lucia-auth.com/basics/users</a>

This will create a new user, and, if `key` is defined, a new `key`.

<a href="https://lucia-auth.com/basics/keys" target="_blank">https://lucia-auth.com/basics/keys</a>

Keys represent the relationship between a user and a reference to that user.

While the user id is the primary way of identifying a user, there are other ways your app may reference a user during the authentication step such as by their username, email, or Github user id.

These identifiers, be it from a user input or an external source, are provided by a **provider**, identified by a `providerId`.

The unique id for that user within the provider is the `providerUserId`. The unique combination of the provider id and provider user id makes up a key.

The `key` here defines the connection between the user and the provided unique username (`providerUserId`) when using the username & password authentication method (`providerId`).

We’ll also store the password in the `key`.

This `key` will be used to get the user and validate the password when logging them in.

The type for the `attributes` property is `Lucia.DatabaseUserAttributes`, to which we added username previously in <a href="https://github.com/robots4life/luscious-lucia#22-update-your-types" target="_blank">**2.2 Update your types**</a>.

```ts
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
```

The form action so far has this code. By returning the `user` after `await auth.createUser()` we can see the created user on the signup page.

**src/routes/signup/+page.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

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

			// let's return the created user back to the sign up page for now
			return { user };
		} catch (e) {
			console.log(e);
		}
	}
} satisfies Actions;
```

On the `signup` page we show the created `user` object from the successful user creation and return it in the default form action.

**src/routes/signup/+page.svelte**

```js
<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;	<== we can get the submitted from data back by adding the form property to the page
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<input type="submit" />
</form>

<a href="/">Home</a>

<!-- we check if the form property has a value and display it -->
{#if form}
	<pre>{JSON.stringify(form, null, 2)}</pre>
{/if}
```

Start Prisma Studio.

<a href="https://www.prisma.io/blog/prisma-studio-3rtf78dg99fe" target="_blank">https://www.prisma.io/blog/prisma-studio-3rtf78dg99fe</a>

Open <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> if it is not automatically opened in your browser after this command.

`px prisma studio`

<img src="/username-password-prisma-sqlite/docs/prisma_studio.png">

Start the development server from another terminal.

`p dev`

<img src="/username-password-prisma-sqlite/docs/sveltekit_index.png">

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a>.

Fill in the form values and submit the form.

username : `JohnSmith4000`
password : `password123456789000`

In your terminal you should have the following output.

```bash
> vite dev



  VITE v4.4.9  ready in 1053 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
username : JohnSmith4000
password : password123456789000
```

On the `signup` page you should see the created `user` object.

<img src="/username-password-prisma-sqlite/docs/created_user_object.png">

Have a look at Prisma Studio now and refresh the page <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a>. You should see that there is in entry in the `User` row as well as `Key` row.

<img src="/username-password-prisma-sqlite/docs/prisma_studio_created_user.png">

Click on `User` to have a look at the created data.

<img src="/username-password-prisma-sqlite/docs/prisma_studio_created_user_details.png">

Well done, you just created your first user with a SvelteKit form default action, using Lucia with Prisma and Sqlite. :tada:

#### 4.2.3 Use `auth.createSession()` and `auth.setSession()` from Lucia

Sessions can be created with `Auth.createSession()` and can be stored as a cookie.

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth#createsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth#createsession</a>

After successfully creating a user, we’ll create a new session with `Auth.createSession()` and store it as a cookie with `AuthRequest.setSession()`.

<a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession</a>

```ts
// create a new session once the user is created
const session = await auth.createSession({
	userId: user.userId,
	attributes: {}
});
// store the session as a cookie on the locals object
locals.auth.setSession(session); // set session cookie
```

The **src/routes/signup/+page.server.ts** file now looks like this with the added `session` and `cookie`.

**src/routes/signup/+page.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

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

			// let's return the created user back to the sign up page for now
			return { user };
		} catch (e) {
			console.log(e);
		}
	}
} satisfies Actions;
```

Go to your Prisma Studio on <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a>, select the `User` row and hit `Delete 1 record` to delete the previously created user. If you have any other users then delete all those as well so that you have zero records in the database.

<img src="/username-password-prisma-sqlite/docs/prisma_studio_delete_user.png">

Go to the `signup` page and now let's create a new user and a session stored as a cookie for that new user.

Fill in the form values and submit the form.

username : `JaneSmith8000`
password : `000987654321password`

<img src="/username-password-prisma-sqlite/docs/create_new_user.png">

Once you submit the form check your terminal, the `username` and `password` values from the form should be logged there.

```bash
> vite dev



  VITE v4.4.9  ready in 890 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
username : JaneSmith8000
password : 000987654321password
```

Again, the SvelteKit default form action returns the newly created `user` object to the page where we display its values.

<img src="/username-password-prisma-sqlite/docs/created_new_user_object.png">

Go to your Prisma Studio on <a href="http://localhost:5555/" target="_blank">http://localhost:5555/</a> and refresh the page.

You should now see a new user and a new session.

<img src="/username-password-prisma-sqlite/docs/prisma_studio_new_created_user_and_session.png">

Click on `User` to see the created user and click on `Session` to the current session for that user.

The created `User`.

<img src="/username-password-prisma-sqlite/docs/prisma_studio_show_new_user.png">

The created `Session`.

<img src="/username-password-prisma-sqlite/docs/prisma_studio_show_new_user_session.png">

Now let's have a look at the created session cookie in the browser development tools.

<img src="/username-password-prisma-sqlite/docs/browser_session_cookie.png">

Well done, you just created a new user and a session for that new user that is stored as a cookie, all this with a SvelteKit form default action, using Lucia with Prisma and Sqlite. :tada:

#### 4.2.4 Handle errors

Lucia throws 2 types of errors: `LuciaError` and database errors from the database driver or ORM you’re using.

<a href="https://lucia-auth.com/reference/lucia/modules/main#luciaerror" target="_blank">https://lucia-auth.com/reference/lucia/modules/main#luciaerror</a>

Most database related errors, such as connection failure, duplicate values, and foreign key constraint errors, are thrown as is. These need to be handled as if you were using just the driver/ORM.

Find details about how Prisma does error handling.

<a href="https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors" target="_blank">https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors</a>

<a href="https://www.prisma.io/docs/reference/api-reference/error-reference" target="_blank">https://www.prisma.io/docs/reference/api-reference/error-reference</a>

<a href="https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes" target="_blank">https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes</a>

<a href="https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/error-formatting" target="_blank">https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/error-formatting</a>

Let's try and log a `PrismaClientKnownRequestError` with Prisma.

<a href="https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror" target="_blank">https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror</a>

<a href="https://www.prisma.io/docs/reference/api-reference/error-reference#p2002" target="_blank">https://www.prisma.io/docs/reference/api-reference/error-reference#p2002</a>

```ts
try {
	// ...
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
			return fail(400, { error: `Unique constraint failed on the ${e?.meta?.target}` });
		}
	}
	// Lucia error
	// https://lucia-auth.com/reference/lucia/modules/main#luciaerror
	if (e instanceof LuciaError) {
		// Lucia error
		console.log(e);
	}
	// throw error;
	throw e;
}
```

Let's have a look at such an error.

We just created a new user `JaneSmith8000` in <a href="https://github.com/robots4life/luscious-lucia#423-use-authcreatesession-and-authsetsession-from-lucia" target="_blank">**4.2.3 Use `auth.createSession()` and `auth.setSession()` from Lucia**</a>.

Now we know from our Prisma schema that the field `username` in the `User` model has to be `unique`.

```prisma
model User {
  id           String    @id @unique
  username     String    @unique	<= username HAS to be unique
  auth_session Session[]
  key          Key[]
}
```

So if we try to create another new user with the same username `JaneSmith8000` we should get an error since a user with that username already exists in the database.

Let's have a look at the error.

Go to the `signup` page <a href="http://localhost:5173/signup" target="_blank">http://localhost:5173/signup</a> and submit a new user with username `JaneSmith8000` and check your terminal.

```bash
username : JaneSmith8000
password : 65465465465465465464
Unique constraint failed on the username


e : PrismaClientKnownRequestError:
Invalid `prisma.user.create()` invocation:


Unique constraint failed on the fields: (`username`)
e.meta : [object Object]
e.meta.target : username
PrismaClientKnownRequestError:
Invalid `prisma.user.create()` invocation:


Unique constraint failed on the fields: (`username`)
    at vn.handleRequestError (/luscious-lucia/node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client/runtime/library.js:123:6730)
    at vn.handleAndLogRequestError (/luscious-lucia/node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client/runtime/library.js:123:6119)
    at vn.request (/luscious-lucia/node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client/runtime/library.js:123:5839)
    at async l (/luscious-lucia/node_modules/.pnpm/@prisma+client@5.2.0_prisma@5.2.0/node_modules/@prisma/client/runtime/library.js:128:9763) {
  code: 'P2002',
  clientVersion: '5.2.0',
  meta: { target: [ 'username' ] }
}
```

If you like to show the error on the page you can return it from the catch block.

The `fail` function is used as part of a SvelteKit form action, it handles validation errors.

<a href="https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors" target="_blank">https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors</a>

If the request couldn't be processed because of invalid data, you can return validation errors - along with the previously submitted form values - back to the user so that they can try again.

The `fail` function lets you return an HTTP status code (typically `400` or `422`, in the case of validation errors) along with the data.

What are the differences between throwing an error and returning `fail` in SvelteKit?
<a href="https://stackoverflow.com/a/76038549" target="_blank">https://stackoverflow.com/a/76038549</a>

Instead of throwing the error you can redirect the user to another page if none of the error conditions you are checking for apply.

<a href="https://kit.svelte.dev/docs/load#redirects" target="_blank">https://kit.svelte.dev/docs/load#redirects</a>

For checking for all possible errors listed in the Prisma reference read this info.
<a href="https://github.com/prisma/prisma/issues/9082" target="_blank">https://github.com/prisma/prisma/issues/9082</a>

```ts
try {
	// ...
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
	// throw a SvelteKit redirect if none of the error conditions apply
	// https://kit.svelte.dev/docs/load#redirects
	// make sure you don't throw inside a try/catch block!
	throw redirect(302, '/');
}
```

On the `signup` page we show the created error object that is returned with the `fail` function in the catch block of the default form action.

The error object is returned as part of the page `form` property for the `signup` page.

**src/routes/signup/+page.svelte**

```js
<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<input type="submit" />
</form>

<a href="/">Home</a>

{#if form}
	<pre>{JSON.stringify(form, null, 2)}</pre>
{/if}
```

The **src/routes/signup/+page.server.ts** file now looks like this with the added `error` handling.

**src/routes/signup/+page.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

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

			// let's return the created user back to the sign up page for now
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
		}
		// throw a SvelteKit redirect if none of the error conditions apply
		// https://kit.svelte.dev/docs/load#redirects
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
} satisfies Actions;
```

Well done, you

- just created a new user
- and a session for that new user
- that is stored as a cookie
- and you are handling errors with Lucia and Prisma
- and finally you are redirecting the user to another page if none of the error conditions apply

all this with a SvelteKit form default action, using Lucia with Prisma and Sqlite. :tada:

#### 4.2.5 Handle case sensitive user input

Depending on your database, `user123` and `USER123` may be treated as different strings.

To avoid 2 users having the same `username` with different cases, we are going to make the `username` lowercase before creating a key.

This is crucial when setting a user-provided input as a provider user id of a key.

**src/routes/signup/+page.server.ts**

```ts
// create a new user
const user = await auth.createUser({
	key: {
		providerId: 'username', // auth method
		// make the user input for username all lowercase
		providerUserId: username.toLowerCase(), // unique id when using "username" auth method
		password // hashed by Lucia
	},
	attributes: {
		username
	}
});
```

On the other hand, making the `username` stored as a user attribute lowercase is optional.

However, if you need to query users using usernames (e.g. url `/user/user123`), it may be beneficial to require the username to be lowercase, store 2 usernames (lowercase and normal), or set the database to ignore casing when compare strings (e.g. using LOWER() in SQL).

## 5.0 Redirect authenticated users

After a new user has successfully registered a new `username` on the `signup` page it makes sense to `redirect` that user to another page of the app instead of staying on the `signup` page.

For example we could redirect the new user to their personal `profile` page. Also, if a user tries to go back to the `signup` page we should redirect them to their `profile` page instead.

<a href="https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#redirect-authenticated-users" target="_blank">https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#redirect-authenticated-users</a>

In the previous step we did create a new user and a session for that user stored in a cookie. We will use the session stored in that cookie to authenticate the user on every new request to the app.

You can validate requests by creating a new `AuthRequest` instance with `Auth.handleRequest()`, which is stored in `locals.auth ` and calling `AuthRequest.validate()`.

<a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest</a>

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth#handlerequest" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth#handlerequest</a>

In <a href="https://github.com/robots4life/luscious-lucia#423-use-authcreatesession-and-authsetsession-from-lucia" target="_blank">4.2.3 Use auth.createSession() and auth.setSession() from Lucia</a> we did create a new session for the newly created user and set a session cookie for them on the `local` object under the `auth` property.

This is where the session is set in the created cookie.

```ts
// create a new session once the user is created
const session = await auth.createSession({
	userId: user.userId,
	attributes: {}
});
// store the session as a cookie on the locals object
locals.auth.setSession(session); // set session cookie
```

Since we are on the `signup` page and submit a form the page reloads per web standards.

<a href="https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data" target="_blank">https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data</a>

So once the page reloads and while we still have the session cookie stored in the app we can define a SvelteKit `load` function that has access to the `locals` object. Remember, on this `locals` object we added the `auth` property with this code.

```ts
locals.auth.setSession(session); // set session cookie
```

The `locals` object can be accessed in hooks, handle, and handleError, server-only load functions, and +server.js files.

It is important to understand that this `locals` object can be accessed by the mentioned functions, all of them being executed in a server-side context.

<a href="https://kit.svelte.dev/docs/types#app-locals" target="_blank">https://kit.svelte.dev/docs/types#app-locals</a>

<a href="https://kit.svelte.dev/docs/hooks#server-hooks-handle" target="_blank">https://kit.svelte.dev/docs/hooks#server-hooks-handle</a>

Let's define a `load` function on the `signup` page and call the `validate` method on the `auth` property of the `locals` object.

The `validate` method returns a `Session` if the user is authenticated or `null` if not.

<a href="https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate</a>

<a href="https://lucia-auth.com/reference/lucia/interfaces#session" target="_blank">https://ucia-auth.com/reference/lucia/interfaces#session</a>

**src/routes/signup/+page.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (session) {
		// we redirect the user to the profile page if the session is valid
		throw redirect(302, '/profile');
	}
	if (!session) {
		// we redirect the user to the index page if the session is not valid
		throw redirect(302, '/');
	}
	// since the load function needs to return data to the page we return an empty object
	return {};
};
```

<a href="https://kit.svelte.dev/docs/form-actions#loading-data" target="_blank">https://kit.svelte.dev/docs/form-actions#loading-data</a>

**After an action runs, the page will be re-rendered (unless a redirect or an unexpected error occurs), with the action's return value available to the page as the form prop. This means that your page's load functions will run after the action completes.**

Since we now do have a `load` function for the `signup` page **WE WANT THE LOAD FUNCTION TO RUN** after the default form action. The page will only be re-rendered if there is no redirect, however we do have a redirect in place after the `try catch` block. Hence we now remove this `redirect` and thus enable the `load` function for the page to re-run after the form action. Note that we are also not returning the `user` object to the page `form` property any more.

```ts
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

import type { PageServerLoad } from './$types';

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

			// let's return the created user back to the sign up page for now
			// return { user };
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
		}
		// throw a SvelteKit redirect if none of the error conditions apply
		// https://kit.svelte.dev/docs/load#redirects
		// make sure you don't throw inside a try/catch block!
		// throw redirect(302, '/');
		// if we want the load function to run and the page to be re-rendered after
		// the form action has complete we omit the redirect and handle further logic in the load function
	}
} satisfies Actions;
```

### 5.1 Create a Profile page

Create a `+page.server.ts` file in `src/routes/profile`. We use the `load` function to load data for the `profile` page.

**src/routes/profile/+page.server.ts**

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (!session) {
		// if the session is not valid we redirect the user back to the index page
		throw redirect(302, '/');
	}
	// if the user session is validated we return the user data to the profile page
	if (session) {
		return {
			userId: session.user.userId,
			username: session.user.username
		};
	}
};
```

The `user` object is available in `Session.user`, and you’ll see that `User.username` exists because we defined it in <a href="https://github.com/robots4life/luscious-lucia#23-configure-lucia" target="_blank">2.3 Configure Lucia</a> with the `getUserAttributes()` configuration.

```ts
// Generate user attributes for the user.
getUserAttributes: (data) => {
	return {
		username: data.username
	};
};
```

Create a `+page.svelte` file in `src/routes/profile`. We use the page `data` property to display the loaded data for that page.

**src/routes/profile/+page.svelte**

```js
<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Profile</h1>

{#if Object.keys(data).length !== 0}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
```

On the `profile` page <a href="http://localhost:5173/profile" target="_blank">http://localhost:5173/profile</a> we can now display the user data.

<img src="/username-password-prisma-sqlite/docs/profile_page_show_user_data.png">

### 5.2 Create a Log in page

<a href="https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#sign-in-page" target="_blank">https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit#sign-in-page</a>

Create a `+page.svelte` file in `src/routes/login`. It will have a form with inputs for username and password.

```js
<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<h1>Log in</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<input type="submit" />
</form>

<a href="/">Home</a>

{#if form}
	<pre>{JSON.stringify(form, null, 2)}</pre>
{/if}
```

Create a `+page.server.ts` file in `src/routes/login`. We use the `load` function to load data for the `login` page.

The key we created for the user allows us to get/read the user via their username, and validate their password.

This can be done with `Auth.useKey()`.

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth#usekey" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth#usekey</a>

If the username and password is **correct**, we’ll create a new session just like we did in <a href="https://github.com/robots4life/luscious-lucia#423-use-authcreatesession-and-authsetsession-from-lucia" target="_blank">4.2.3 Use auth.createSession() and auth.setSession() from Lucia</a>.

If the username or password is **incorrect**, Lucia will throw an error. Make sure to make the `username` lowercase before calling `useKey()`.

**src/routes/login/+page.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		//
		// READ the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);

		// basic check
		if (typeof username !== 'string' || username.length < 1 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			// https://lucia-auth.com/reference/lucia/interfaces/auth#usekey
			// find user by key and check if the password is defined and check if the password is correct/valid
			const key = await auth.useKey('username', username.toLowerCase(), password);

			// https://lucia-auth.com/reference/lucia/interfaces/auth#createsession
			// create a new session once the user is validated
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			// https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession
			// store the session on the locals object and set session cookie
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist or invalid password
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// throw a SvelteKit redirect if none of the error conditions apply
		// https://kit.svelte.dev/docs/load#redirects
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
```

If the username and password are correct and validated we should redirect the user to the `profile` page. Again, this is done be defining a `load` function.

**src/routes/login/+page.server.ts**

```ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (session) {
		// we redirect the user to the profile page if the session is valid
		throw redirect(302, '/profile');
	}
	if (!session) {
		// we redirect the user to the index page if the session is not valid
		throw redirect(302, '/');
	}
	// since the load function needs to return data to the page we return an empty object
	return {};
};
```

The **src/routes/login/+page.server.ts** file now looks like this with the added `load` function to redirect to the `profile` page.

<a href="https://kit.svelte.dev/docs/form-actions#loading-data" target="_blank">https://kit.svelte.dev/docs/form-actions#loading-data</a>

**After an action runs, the page will be re-rendered (unless a redirect or an unexpected error occurs), with the action's return value available to the page as the form prop. This means that your page's load functions will run after the action completes.**

Since we now do have a `load` function for the `login` page **WE WANT THE LOAD FUNCTION TO RUN** after the default form action. The page will only be re-rendered if there is no redirect, however we do have a redirect in place after the `try catch` block. Hence we now remove this `redirect` and thus enable the `load` function for the page to re-run after the form action.

**src/routes/login/+page.server.ts**

```ts
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (session) {
		// we redirect the user to the profile page if the session is valid
		throw redirect(302, '/profile');
	}
	if (!session) {
		// we redirect the user to the index page if the session is not valid
		throw redirect(302, '/');
	}
	// since the load function needs to return data to the page we return an empty object
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		//
		// READ the user with the supplied form data
		const formData = await request.formData();

		const username = formData.get('username');
		console.log(`username : ` + username);

		const password = formData.get('password');
		console.log(`password : ` + password);

		// basic check
		if (typeof username !== 'string' || username.length < 1 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			// https://lucia-auth.com/reference/lucia/interfaces/auth#usekey
			// find user by key and check if the password is defined and check if the password is correct/valid
			const key = await auth.useKey('username', username.toLowerCase(), password);

			// https://lucia-auth.com/reference/lucia/interfaces/auth#createsession
			// create a new session once the user is validated
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			// https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession
			// store the session on the locals object and set session cookie
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist or invalid password
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// throw a SvelteKit redirect if none of the error conditions apply
		// https://kit.svelte.dev/docs/load#redirects
		// make sure you don't throw inside a try/catch block!
		// throw redirect(302, '/');
		// if we want the load function to run and the page to be re-rendered after
		// the form action has complete we omit the redirect and handle further logic in the load function
	}
};
```

### 5.3 Add a link to the Profile page

On the index page add a link to the `profile` page and try to access this page if you are logged in and if you are not logged in.

If you are not logged in you will be redirected to the index page.

If you have just signed up with a new user you will be redirected to the profile page.

**src/routes/+page.svelte**

```js
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<a href="/signup">Sign up</a>
<a href="/login">Log in</a>
<a href="/profile">Profile</a>
```

## 6.0 Sign out users

So far we have shown user data on the `profile` page.

Now we are going to enable users to sign out on the profile page.

For this we are going to add a simple form that will be connected to a named SvelteKit form action.

**src/routes/profile/+page.svelte**

```js
<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Profile</h1>

{#if Object.keys(data).length !== 0}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}

<form method="post" action="?/logout">
	<input type="submit" value="Sign out" />
</form>

<a href="/">Home</a>
```

### 6.1 Sign out users with a SvelteKit named form action

<a href="https://kit.svelte.dev/docs/form-actions#named-actions" target="_blank">https://kit.svelte.dev/docs/form-actions#named-actions</a>

Instead of one `default` action, a page can have as many `named` actions as it needs.

When logging out users, it’s critical that you invalidate the user’s session.

This can be achieved with `Auth.invalidateSession()`.

<a href="https://lucia-auth.com/reference/lucia/interfaces/auth#invalidatesession" target="_blank">https://lucia-auth.com/reference/lucia/interfaces/auth#invalidatesession</a>

You can delete the session cookie by overriding the existing one with a blank cookie that expires immediately.

This can be done by passing `null` to `AuthRequest.setSession()`.

**src/routes/profile/+page.server.ts**

```ts
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	// call the validate() method to check for a valid session
	// https://lucia-auth.com/reference/lucia/interfaces/authrequest#validate
	const session = await locals.auth.validate();

	if (!session) {
		// if the session is not valid we redirect the user back to the index page
		throw redirect(302, '/');
	}
	// if the user session is validated we return the user data to the profile page
	if (session) {
		return {
			userId: session.user.userId,
			username: session.user.username
		};
	}
	// since the load function needs to return data to the page we return an empty object
	return {};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		// https://lucia-auth.com/reference/lucia/interfaces/auth#invalidatesession
		await auth.invalidateSession(session.sessionId); // invalidate session

		// https://lucia-auth.com/reference/lucia/interfaces/authrequest#setsession
		locals.auth.setSession(null); // remove cookie

		throw redirect(302, '/'); // redirect to the index page
	}
};
```
