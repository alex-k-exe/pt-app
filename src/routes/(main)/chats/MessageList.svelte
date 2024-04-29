<script lang="ts">
	import { type Message } from '$lib/drizzleTables';

	export let userName: string;
	export let messages: (Message & { sendersName: string })[];
</script>

{#each messages as message}
	<div><b>{message.sendersName === userName ? 'You' : message.sendersName}</b>: {message.text}</div>
{/each}
