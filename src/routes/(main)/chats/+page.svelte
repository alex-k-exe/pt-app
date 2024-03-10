<script>
	import ChatList from './ChatList.svelte';
</script>

<div class="chats">
	<div class="chatList"><ChatList chats={[]} /></div>
	<div class="chatHeader">chatHeader</div>
	<div class="messageList">messageList</div>
	<div class="messageBox">messageBox</div>
</div>

<style>
	.chats {
		max-width: 100%;
		display: grid;
		border-color: black;
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
</style>
