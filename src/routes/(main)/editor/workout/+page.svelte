<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import SelectClient from '$lib/components/SelectClient.svelte';
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { dayjs } from '$lib/utils/dates.ts';
	import { locations, validDate, type ObjectValues } from '$lib/utils/types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import ExercisesEditor from '../ExercisesEditor.svelte';
	import { formSchema } from './schema.ts';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	$formData = data.workout;

	let selectedClient: { id: string; name: string } | null = null;
	$: $formData.clientId = selectedClient?.id ?? '';

	let selectedLocation: ObjectValues<typeof locations> | null = null;
	$: $formData.location = selectedLocation;

	let deleteForm: HTMLFormElement;
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

		<a href={`/workouts/day-view?date=${dayjs(data.workout.date).format(validDate.format)}`}
			><u>Go back to workouts</u></a
		>
		{#if data.trainersClients && data.trainersClients.length > 0}
			<Form.Button type="submit">Save</Form.Button>
		{/if}
	</div>

	<div class="timeThings">
		From <TimePicker bind:selectedTimeString={$formData.startTime} />
	</div>
	<div class="timeThings">to <TimePicker bind:selectedTimeString={$formData.endTime} /></div>
	<div class="timeThings">on <DatePicker bind:selectedDateString={$formData.date} /></div>

	<Textarea name="notes" placeholder="Notes" bind:value={$formData.notes} />

	<Select.Root
		selected={{ value: selectedLocation, label: selectedLocation ?? 'Select a location' }}
		onSelectedChange={(event) => (selectedLocation = event?.value ?? null)}
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

	{#if data.workout.id}
		<form method="POST" action="?/delete" bind:this={deleteForm}>
			<input type="hidden" value={dayjs(data.workout.date).format(validDate.format)} name="date" />
			<input type="hidden" value={data.workout.id} name="workoutId" />
			<DestructiveButton
				triggerText="Delete this workout"
				on:confirm={() => deleteForm.requestSubmit()}
			/>
		</form>
	{/if}

	<ExercisesEditor bind:series={$formData.series} />
</form>

<style>
	.timeThings {
		display: flex;
		align-items: center;
	}
</style>
