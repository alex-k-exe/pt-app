<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Chat } from '$lib/server/drizzleTables';
	import { MessageCirclePlus } from 'lucide-svelte';

	export let chats: Chat[];
</script>

<div style="text-align: center; margin-top: 10px">
	<Button>
		<MessageCirclePlus />
		New chat
	</Button>
</div>

<div style="margin: 15px 20px 0px 10px">
	{#each chats as chat (chat.id)}
		<Button class="mb-2 block h-auto w-full py-2 text-left" variant="outline">
			<p style="font-size: 20px">{chat.id}</p>
			<p>No new messages</p>
		</Button>
	{/each}
</div>
