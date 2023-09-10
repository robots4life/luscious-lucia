<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if Object.keys(data).length !== 0}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
