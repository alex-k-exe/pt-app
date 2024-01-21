<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<ModeWatcher defaultMode={'dark'} />
<div class="root">
	<Navbar />
	<slot />
</div>
