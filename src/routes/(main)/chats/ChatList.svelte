<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Svelecte from 'svelecte';
	import type { SimpleChat, SimpleUser } from './+page.server';

	export let chats: SimpleChat[];
	export let trainers: SimpleUser[];
	export let selectedChatId: number = chats[0].id;
</script>

<form method="POST" action="?/createNewChat" style="text-align: center; margin-top: 10px">
	<Svelecte options={trainers} valueField="id" labelField="name" name="trainerId" />
	<Button>New chat</Button>
</form>

<form method="POST" action="?/selectNewChat" style="margin: 15px 20px 0px 10px">
	<input type="hidden" name="selectedChatId" bind:value={selectedChatId} />
	{#each chats as chat (chat.id)}
		<Button class="mb-2 block h-auto w-full py-2 text-left" variant="outline">
			<p style="font-size: 20px">{chat.id}</p>
			<p>No new messages</p>
		</Button>
	{/each}
</form>
