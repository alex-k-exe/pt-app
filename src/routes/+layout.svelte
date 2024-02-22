<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<ModeWatcher defaultMode="light" />
<div class="container">
	<Navbar />
	<slot />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		padding: 10px;
		column-gap: 20px;
	}
</style>