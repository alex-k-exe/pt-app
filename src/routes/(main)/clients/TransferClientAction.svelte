<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.ts';
	import type { User } from '$lib/drizzleTables';
	import { MoveRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let trainers: User[];
	let selectedTrainer: User | undefined;

	const dispatch = createEventDispatcher();
</script>

<div>
	<Select.Root
		selected={{ value: selectedTrainer?.id, label: selectedTrainer?.name }}
		onSelectedChange={(event) =>
			(selectedTrainer = trainers.find((trainer) => trainer.id === event?.value))}
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
		<Select.Input name="location" />
	</Select.Root>

	<Button
		variant="outline"
		size="icon"
		on:click={() => dispatch('transferClient', selectedTrainer?.id)}
	>
		<MoveRight />
	</Button>
</div>
