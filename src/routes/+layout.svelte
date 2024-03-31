<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<ModeWatcher defaultMode="system" />
<div style="margin: 10px;">
	<slot />
</div>
