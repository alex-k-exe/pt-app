<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, { validators: zodClient(formSchema) });
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	From <TimePicker bind:selectedTimeString={$formData.startTime} />
	to <TimePicker bind:selectedTimeString={$formData.endTime} />
	on <DatePicker />
	<Form.Button>Save</Form.Button>
</form>

<div class="dateTimePicker">
	to <Input placeholder="e.g. 12:45pm" />
	on
</div>

<Select.Root>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Select a location" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each locations as location}
				<Select.Item value={location.value} label={location.label}>{location.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="location" />
</Select.Root>

<!-- TODO: decide if I really need reminders -->
<Label for="notes">Notes</Label>
<Textarea id="notes" value="" class="max-w-screen-sm" placeholder="Write other details here" />

<Button class="w-fit">Delete workout</Button>

<div class="workoutEditor">
	<div>
		<Button variant="outline" on:click={() => handleAddElement('Series')}>Add another Series</Button
		>
		<Button variant="outline">Add another Exercise</Button>
	</div>
	<div class="createdWorkout" use:dndzone={{ items: workout.series ?? [], flipDurationMs }}>
		{#each workout.series ?? [] as item, i (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<SeriesCard exercises={[]} name={numberToLetter(i + 1)} />
			</div>
		{/each}
	</div>
</div>
