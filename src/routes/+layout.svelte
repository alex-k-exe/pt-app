<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
	import Navbar from './Navbar.svelte';
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
