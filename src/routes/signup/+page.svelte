<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types.js';
	export let data: PageData;
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

<pre>{JSON.stringify(data, null, 2)}</pre>

{#if form}
	<pre>{JSON.stringify(form, null, 2)}</pre>
{/if}
