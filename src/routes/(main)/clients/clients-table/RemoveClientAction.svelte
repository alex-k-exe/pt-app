<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';

	export let clientId: string;
</script>

<form method="POST" action="?/delete">
	<input type="hidden" name="clientId" value={clientId} />
	<Button variant="outline" size="icon">
		<X />
	</Button>
</form>
