<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { locations } from '$lib/utils/types/other';
	import dayjs from 'dayjs';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, { validators: zodClient(formSchema) });
	const { form: formData, enhance } = form;

	let date = dayjs($formData.date);
</script>

<form method="POST" use:enhance>
	<div class="flex">
		<Select.Root>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Select a location" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each locations as location}
						<Select.Item value={location.value} label={location.label}>{location.label}</Select.Item
						>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="location" />
		</Select.Root>
		<Input name="title" placeholder="Add a title" bind:value={$formData.title} />
		<Form.Button type="submit">Save</Form.Button>
		<a href="/workouts">Cancel</a>
	</div>

	From <TimePicker name="startTime" bind:selectedTimeString={$formData.startTime} />
	to <TimePicker name="endTime" bind:selectedTimeString={$formData.endTime} />
	on <DatePicker name="date" bind:selectedDate={date} />

	<Textarea
		name="notes"
		label="Notes"
		placeholder="Write other details here"
		bind:value={$formData.notes}
	/>
</form>

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
