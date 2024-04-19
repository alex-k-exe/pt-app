<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { locations } from '$lib/utils/types/other';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SelectClient from '../../../../lib/components/SelectClient.svelte';
	import ExercisesEditor from '../ExercisesEditor.svelte';
	import { formSchema } from './schema.ts';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	let selectedClient: { id: string; name: string } | null = null;
	$: if (selectedClient?.id) $formData.clientId = selectedClient?.id;
	$formData.trainerId = data.workout.trainerId;
	$formData.date = data.workout.date;
</script>

<form method="POST" action="?/insertOrUpdate" use:enhance>
	<div class="flex">
		<Form.Field {form} name="title">
			<Form.Control let:attrs>
				<Form.Label>Title</Form.Label>
				<Input {...attrs} placeholder="Add a title" bind:value={$formData.title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<SelectClient bind:selectedClient clients={data.trainersClients} />

		<a href="/workouts">Cancel</a>
		<Form.Button>Save</Form.Button>
	</div>

	<div class="timeThings">From <TimePicker bind:selectedDate={$formData.startTime} /></div>
	<div class="timeThings">to <TimePicker bind:selectedDate={$formData.endTime} /></div>
	<div class="timeThings">on <DatePicker bind:selectedDate={$formData.date} /></div>

	<Textarea name="notes" placeholder="Notes" bind:value={$formData.notes} />

	<Select.Root>
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

	{#if data.workout.id}
		<form method="POST" action="?delete">
			<DestructiveButton triggerText="Delete this workout" />
		</form>
	{/if}

	<ExercisesEditor bind:series={$formData.series} bind:sets={$formData.sets} />
</form>

<style>
	.timeThings {
		display: flex;
		align-items: center;
	}
</style>
