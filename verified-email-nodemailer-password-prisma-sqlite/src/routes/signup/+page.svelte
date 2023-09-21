<script lang="ts">
	// export the form property on this page
	// to show the return value of the form action on the page
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<a href="/">Home</a>
<a href="/login">Log In With Email</a>
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
<pre class:error={form?.message}>{JSON.stringify(form, null, 2)}</pre>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	button {
		border-radius: 10px;
	}
	.error {
		background-color: darkred;
		color: lightgoldenrodyellow;
		border-radius: 10px;
		border: 4px solid darkslateblue;
	}
</style>
