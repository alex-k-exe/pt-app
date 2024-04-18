<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { daysOfTheWeek, locations } from '$lib/utils/types/other';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import ExercisesEditor from '../ExercisesEditor.svelte';
	import SelectClient from '../SelectClient.svelte';
	import { formSchema } from './schema.ts';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	let selectedClient: { id: string; name: string } | null =
		data.trainersClients?.find((client) => client.id === data.daily.clientId) ?? null;
	$: if (selectedClient?.id) $formData.clientId = selectedClient.id;
	$formData.trainerId = data.daily.trainerId;

	let activeDays = data.daily.activeDays.split('').map((active) => active === '1');
	$: {
		$formData.activeDays = activeDays.map((active) => (active ? '1' : '0')).join('');
	}
	$formData.trainerId = data.daily.trainerId;
</script>

<form method="POST" action="?/insertOrUpdate" use:enhance>
	<div class="flex">
		<SelectClient
			{form}
			bind:title={$formData.title}
			trainersClients={data.trainersClients}
			bind:selectedClient
		/>

		<a href="/dailies">Cancel</a>
		<Form.Button>Save</Form.Button>
	</div>

	<Form.Field {form} name="startTime">
		<Form.Control>
			<Form.Label>Start time</Form.Label>
			<TimePicker bind:selectedDate={$formData.startTime} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="endTime">
		<Form.Control>
			<Form.Label>End time</Form.Label>
			<TimePicker bind:selectedDate={$formData.endTime} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	On these days:
	<div class="flex flex-wrap gap-2">
		{#each activeDays as active, i}
			<Button
				variant={active ? 'default' : 'outline'}
				size="icon"
				on:click={() => {
					activeDays = [...activeDays.slice(0, i), !activeDays[i], ...activeDays.slice(i + 1)];
				}}>{daysOfTheWeek[i][0]}</Button
			>
		{/each}
	</div>

	<Textarea name="notes" placeholder="Notes" bind:value={$formData.notes} />

	<Select.Root
		selected={{ value: $formData.location, label: $formData.location ?? 'Select a location' }}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a location" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each Object.values(locations) as location}
					<Select.Item bind:value={location} label={location}>{location}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="location" />
	</Select.Root>

	{#if data.daily.id}
		<form method="POST" action="?delete">
			<input type="hidden" name="id" value={data.daily.id} />
			<Button>Delete this daily</Button>
		</form>
	{/if}

	<ExercisesEditor bind:series={$formData.series} bind:sets={$formData.sets} />
</form>
