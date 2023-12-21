<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<SvelteToast />
<ModeWatcher defaultMode={'dark'} />
<div class="root">
	<Navbar />
	<slot />
</div>
