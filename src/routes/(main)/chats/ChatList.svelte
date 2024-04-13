<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';

	export let chats: { id: number; otherUsersName: string; hasBeenRead: boolean }[];
	export let trainers: { id: string; name: string }[];
	export let selectedChatId: number | null = chats.length > 0 ? chats[0].id : null;

	let selectedTrainer: { id: string; name: string } | null = null;
</script>

<form method="POST" action="?/createNewChat" class="align-center mt-10 overflow-y-visible">
	<Select.Root
		selected={{ value: selectedTrainer?.id, label: selectedTrainer?.name }}
		onSelectedChange={(event) => {
			if (!event || !event.value || !event.label) return;
			selectedTrainer = { id: event.value, name: event.label };
		}}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a trainer" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each trainers as trainer}
					<Select.Item value={trainer.id} label={trainer.name}>{trainer.name}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="otherUserId" />
	</Select.Root>
	<Button type="submit">New chat</Button>
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
