<img src="/lucia.png">

# Authentication with Email authenticated by verification link, Nodemailer, Password and Password Reset Link using SvelteKit, Lucia, Prisma and SQLite

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

## 1.0 Workflow

For sending emails from our app we are going to use <a href="https://nodemailer.com/" target="_blank">https://nodemailer.com/</a>.

During development we are going to preview / check sent email with <a href="https://ethereal.email/" target="_blank">https://ethereal.email/</a>.

Once everything works in development we are going to use a free <a href="https://sendgrid.com/pricing/" target="_blank">https://sendgrid.com/pricing/</a> SendGrid account that allows us to send up to 100 emails per day.

Last not least we are going to deploy our app to Vercel.

### 1.1 Set up basic app styles, layout and email page with a SvelteKit named action

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
<a href="/">Home</a>

<hr />
<h1>Email</h1>
<hr />

<h2>Send Test Email</h2>
<form id="send_test_email" method="POST" action="?/send_test_email">
	<label for="send-test-text">Text</label>
	<input type="text" name="send-test-text" id="send-test-text" value="lorem ipsum email" />
	<label for="send-test-number">Number</label>
	<input type="number" name="send-test-number" id="send-test-number" value="123456789" />
	<button form="send_test_email" type="submit">Submit</button>
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

<a href="https://kit.svelte.dev/docs/form-actions#named-actions" target="_blank">https://kit.svelte.dev/docs/form-actions#named-actions</a>

**src/routes/email/+page.server.ts**

```ts
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	send_test_email: async ({ request }) => {
		const formData = await request.formData();

		const formEntires = [];
		for (const pair of formData.entries()) {
			console.log(`${pair[0]} : ${pair[1]}`);
			formEntires.push({ [pair[0]]: pair[1] });
		}

		return { formEntires };
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
send-test-text : lorem ipsum email
send-test-number : 123456789
send-test-text : lorem ipsum email
send-test-number : 123456789
```

We have just set up basic app styles, a layout and an `email` page with a SvelteKit named form action. :tada:

### 1.2 Set up Nodemailer

Install Nodemailer.

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
