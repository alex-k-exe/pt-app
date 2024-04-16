<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import type { User } from 'lucia';

	export let form: any;
	export let selectedClient: { id: string; name: string } | null = null;
	export let trainersClients: Pick<User, 'id' | 'name'>[] | null;
	export let title: string;
</script>

<Form.Field {form} name="title">
	<Form.Control let:attrs>
		<Form.Label>Title</Form.Label>
		<Input {...attrs} placeholder="Add a title" bind:value={title} />
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
{#if trainersClients}
	<Form.Field {form} name="clientId">
		<Form.Control let:attrs>
			<Select.Root
				selected={{ value: selectedClient?.id, label: selectedClient?.name }}
				onSelectedChange={(event) => {
					if (!event || !event.value || !event.label) return;
					selectedClient = { id: event.value, name: event.label };
				}}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select a client" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each trainersClients as { id, name }}
							<Select.Item value={id} label={name}>{name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input {...attrs} />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
{/if}
