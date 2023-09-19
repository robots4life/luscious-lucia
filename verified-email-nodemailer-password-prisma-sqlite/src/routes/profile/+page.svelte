<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<a href="/">Home</a>

<hr />
<h1>Profile</h1>
<hr />

<h2>Account Details</h2>
<p>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem nisi error voluptatum,
	nemo unde non minus officia dolorum! Incidunt, ullam!
</p>

<pre>{JSON.stringify(data, null, 2)}</pre>
