<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card } from '$lib/components/ui/card';
	import { MessageCirclePlus } from 'lucide-svelte';
</script>

<div style="text-align: center">
	<Button>
		<MessageCirclePlus />
		New chat
	</Button>
</div>

<div style="padding: 10px; padding-top: 5px">
	{#each [0, 1, 2, 3, 4, 5, 6] as i}
		<Card style="padding: 10px; margin-top: 10px; margin-right: 10px;">
			<p style="font-size: 20px">Person {i}</p>
			<p>No new messages</p>
		</Card>
	{/each}
</div>
