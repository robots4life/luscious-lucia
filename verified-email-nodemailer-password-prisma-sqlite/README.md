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

## 1.0 Email workflow

For sending emails from our app we are going to use <a href="https://nodemailer.com/" target="_blank">https://nodemailer.com/</a>.

During development we are going to preview / check sent email with <a href="https://ethereal.email/" target="_blank">https://ethereal.email/</a>.

Once everything works in development we are going to use a free <a href="https://sendgrid.com/pricing/" target="_blank">https://sendgrid.com/pricing/</a> SendGrid account that allows us to send up to 100 emails per day.

### 1.1 Set up basic app styles, layout and email page with a SvelteKit default action

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
<form id="send_test_email" method="POST">
	<label for="send_text">Text</label>
	<input type="text" name="send_text" id="send_text" value="Lorem Ipsum Email Text" />
	<label for="send_number">Number</label>
	<input type="number" name="send_number" id="send_number" value="123456789" />
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

We have just set up basic app styles, a layout and an `email` page with a SvelteKit named form action. :tada:

### 1.2 Set up Nodemailer

Install Nodemailer as dependencies.

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

Install types for Nodemailer as devDependencies.

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
