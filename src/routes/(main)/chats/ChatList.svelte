<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Svelecte from 'svelecte';

	export let chats: { id: number; otherUsersName: string; hasBeenRead: boolean }[];
	export let trainers: { id: string; name: string }[];
	export let selectedChatId: number = chats[0].id;
</script>

<form method="POST" action="?/createNewChat" style="text-align: center; margin-top: 10px">
	<Svelecte options={trainers} valueField="id" labelField="name" name="otherUserId" />
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
