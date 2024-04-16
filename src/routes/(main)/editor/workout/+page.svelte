<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { locations } from '$lib/utils/types/other';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SelectClient from '../SelectClient.svelte';
	import WorkoutEditor from '../WorkoutEditor.svelte';
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
		<SelectClient
			{form}
			bind:selectedClient
			trainersClients={data.trainersClients}
			bind:title={data.workout.title}
		/>

		<a href="/workouts">Cancel</a>
		<Form.Button>Save</Form.Button>
	</div>

	<div class="timeThings">
		From <TimePicker bind:selectedDate={$formData.startTime} />
	</div>
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
			<Button variant="destructive" type="submit">Delete this workout</Button>
		</form>
	{/if}

	<WorkoutEditor bind:series={$formData.series} bind:sets={$formData.sets} />
</form>

<style>
	.timeThings {
		display: flex;
		align-items: center;
	}
</style>
