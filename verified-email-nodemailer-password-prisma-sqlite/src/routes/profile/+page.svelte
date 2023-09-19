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
