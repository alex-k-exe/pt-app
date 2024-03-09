<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<ModeWatcher defaultMode="light" />
<div class="container">
	<div class="navbar">
		<Navbar />
	</div>
	<slot class="slot" />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 15px;
		column-gap: 20px;
	}

	.navbar {
		max-height: 15%;
	}
</style>
