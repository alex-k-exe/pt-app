<script>
	import ChatList from './ChatList.svelte';
</script>

<div class="chats">
	<div class="chatList"><ChatList /></div>
	<div class="chatHeader">chatHeader</div>
	<div class="messageList">messageList</div>
	<div class="messageBox">messageBox</div>
</div>

<style>
	.chats {
		display: grid;
		border-color: black;
		grid-template-columns: 1fr 3fr;
		grid-template-rows: 2fr 5fr 1fr;
	}

	.chatList {
		grid-row: 1 / span 3;
	}

	.chatHeader {
		grid-column: 2;
		grid-row: 0;
	}
</style>
