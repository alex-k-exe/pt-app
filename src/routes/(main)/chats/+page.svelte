<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Send } from 'lucide-svelte';
	import ChatList from './ChatList.svelte';
	import MessageList from './MessageList.svelte';

	export let data;
</script>

<svelte:head>
	<title>Chats</title>
	<meta name="chats" content="Your chats and messages with other trainers and clients" />
</svelte:head>

<div class="chats">
	<div class="chatList">
		<ChatList
			chats={data.chats}
			trainers={data.trainers}
			selectedChatId={data.selectedChat?.id ?? null}
		/>
	</div>
	{#if data.selectedChat}
		<form method="POST" action="?/deleteChat" class="chatHeader">
			<input type="hidden" name="chatId" value={data.selectedChat.id} />
			Chat with <b>{data.selectedChat.otherUsersName}</b>
			<Button type="submit">Delete chat</Button>
		</form>
		<div class="messageList">
			<MessageList messages={data.selectedChat.messages} />
		</div>
		<form method="POST" action="?/sendMessage" class="messageBox">
			<input type="hidden" name="chatId" value={data.selectedChat.id} />
			<Input placeholder="Type a message" name="text" />
			<Button type="submit" variant="outline" size="icon">
				<Send />
			</Button>
		</form>
	{:else}
		<div class="place-items-center">Select a chat</div>
	{/if}
</div>

<style>
	.chats {
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-template-rows: 2fr 5fr 1fr;
		overflow-y: scroll;
	}

	.chatList {
		grid-row: 1 / span 3;
		overflow-y: auto;
	}

	.chatHeader {
		grid-column: 2;
		grid-row: 0;
	}

	.messageBox {
		display: flex;
	}
</style>
