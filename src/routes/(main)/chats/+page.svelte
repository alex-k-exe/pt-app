<script>
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Send } from 'lucide-svelte';
	import ChatList from './ChatList.svelte';
</script>

<svelte:head>
	<title>Chats</title>
	<meta name="chats" content="Your chats and messages with other trainers and clients" />
</svelte:head>

<div class="chats">
	<div class="chatList"><ChatList chats={[]} /></div>
	<div class="chatHeader">chatHeader</div>
	<div class="messageList">messageList</div>
	<div class="messageBox">
		<Input placeholder="Type a message" />
		<Button variant="outline" size="icon">
			<Send />
		</Button>
	</div>
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
