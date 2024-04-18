<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.ts';
	import type { User } from '$lib/drizzleTables';
	import { MoveRight } from 'lucide-svelte';

	export let trainers: User[];
	export let clientId: string;

	let selectedTrainer: { id: string; name: string } | null;
</script>

<form method="POST" action="?/transferClient" class="flex">
	<input type="hidden" name="clientId" value={clientId} />
	<input type="hidden" name="newTrainerId" value={selectedTrainer?.id ?? ''} />
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
	</Select.Root>

	<Button variant="outline" size="icon" type="submit">
		<MoveRight />
	</Button>
</form>
