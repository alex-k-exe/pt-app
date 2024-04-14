<script lang="ts">
	import { type Message } from '$lib/drizzleTables';

	export let messages: (Message & { sendersName: string })[];
</script>

{#each messages as message}
	<div><b>{message.sendersName}</b>: {message.text}</div>
{/each}
