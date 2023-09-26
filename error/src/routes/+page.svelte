<script lang="ts">
	import type { PageData } from './$types';
	import type { ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;
</script>

{#if Object.keys(data).length !== 0}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}

<pre>{JSON.stringify(form, null, 2)}</pre>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form id="default" method="POST">
	<label for="default_form">Form Input</label>
	<input type="number" name="default_form_number" id="default_form" value="987654321" />
	<button form="default" type="submit">Submit</button>
</form>
