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
