<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let clientId: string;

	const dispatch = createEventDispatcher();
</script>

<Button
	variant="outline"
	size="icon"
	on:click={() => {
		dispatch('removeTrainer', clientId);
		return undefined;
	}}
>
	<X />
</Button>
