<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { User } from 'lucia';

	export let selectedClient: { id: string; name: string } | null = null;
	export let afterOnSelectedChange: () => void = () => {};

	export let clients: Pick<User, 'id' | 'name'>[] | null = null;
</script>

{#if clients}
	<Select.Root
		selected={{ value: selectedClient?.id, label: selectedClient?.name }}
		onSelectedChange={(event) => {
			if (!event || !event.value || !event.label) return;
			selectedClient = { id: event.value, name: event.label };
			console.log('change');
			afterOnSelectedChange();
		}}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a client" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each clients as { id, name }}
					<Select.Item value={id} label={name}>{name}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
{/if}
