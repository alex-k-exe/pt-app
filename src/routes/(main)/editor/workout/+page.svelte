<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.ts';
	import { numberToLetter } from '$lib/utils/other';
	import { locations } from '$lib/utils/types/other';
	import dayjs from 'dayjs';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SetComponent from '../SetComponent.svelte';
	import { formSchema } from '../schema';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, { validators: zodClient(formSchema) });
	const { form: formData, enhance } = form;
	let date = dayjs($formData.date);

	const flipDurationMs = 300;
	function handleAddElement(elementType: 'series' | 'exercise') {
		if (elementType === 'series') {
			$formData.series = [
				...$formData.series,
				{
					index: $formData.series.length,
					reps: 1,
					sets: []
				}
			];
		} else {
			$formData.sets = [
				...$formData.sets,
				{
					index: $formData.sets.length,
					exerciseName: 'Example'
				}
			];
		}
	}
</script>

<!-- TODO: sets: {
        index: number;
        exerciseName: string;
        id?: number | undefined;
        reps?: string | null | undefined;
        weight?: string | null | undefined;
        duration?: string | null | undefined;
        rpe?: string | null | undefined;
    }[];
    index: number;
    reps: number;
    id?: number | undefined; -->
<form method="POST" action="?insertOrUpdate" use:enhance>
	<div class="flex">
		<div class="items-start">
			<Select.Root>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select a location" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each locations as location}
							<Select.Item value={location.value} label={location.label}>
								{location.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="location" />
			</Select.Root>
			<Input name="title" placeholder="Add a title" bind:value={$formData.title} />
		</div>
		<div class="items-end">
			<Form.Button type="submit">Save</Form.Button>
			<a href="/workouts">Cancel</a>
		</div>
	</div>

	From <TimePicker name="startTime" bind:selectedTimeString={$formData.startTime} />
	to <TimePicker name="endTime" bind:selectedTimeString={$formData.endTime} />
	on <DatePicker name="date" bind:selectedDate={date} />

	<Textarea name="notes" placeholder="Notes" bind:value={$formData.notes} />

	<Select.Root>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a location" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each locations as location}
					<Select.Item bind:value={location.value} label={location.label}
						>{location.label}</Select.Item
					>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="location" />
	</Select.Root>

	<form method="POST" action="?delete">
		<Button>Delete this workout</Button>
	</form>

	<div class="workoutEditor">
		<div>
			<Button variant="outline" on:click={() => handleAddElement('series')}
				>Add another Series</Button
			>
			<Button variant="outline" on:click={() => handleAddElement('exercise')}
				>Add another Exercise</Button
			>
		</div>
		<div
			class="createdWorkout"
			use:dndzone={{ items: [...$formData.series, ...$formData.sets], flipDurationMs }}
		>
			{#each $formData.series ?? [] as series, i (i)}
				<div animate:flip={{ duration: flipDurationMs }}>
					<Card.Root class="w-fit">
						<Card.Header>
							<Card.Title class="flex w-fit items-center"
								>Series {numberToLetter(series.index)}</Card.Title
							>
							<Card.Description class="flex w-fit items-center"
								>Repeat <Input placeholder="n" /> times
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div use:dndzone={{ items: series.sets, flipDurationMs }}>
								{#each series.sets ?? [] as set, j (j)}
									<!-- TODO: implement comparison set -->
									<div animate:flip={{ duration: flipDurationMs }}>
										<SetComponent {set} />
									</div>
								{/each}
							</div>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<Button variant="outline">Cancel</Button>
							<Button>Deploy</Button>
						</Card.Footer>
					</Card.Root>
				</div>
			{/each}
		</div>
	</div>
</form>
