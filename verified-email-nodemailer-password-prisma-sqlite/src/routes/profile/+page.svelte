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

<form id="log_out" method="post">
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
