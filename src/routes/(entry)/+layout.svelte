<script lang="ts">
	import { createPathURIComponent } from '$lib/utils/other.js';

	export let data;
</script>

<div class="flex justify-items-center gap-20">
	<h1>PT App</h1>
	<a href={`/signup${createPathURIComponent(data.targetPath)}`}><h2>Sign up</h2></a>
	<a href={`/login${createPathURIComponent(data.targetPath)}`}><h2>Log in</h2></a>
</div>

<slot />
