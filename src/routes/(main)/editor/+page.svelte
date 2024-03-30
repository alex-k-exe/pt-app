<script lang="ts">
	import TimePicker from '$lib/components/TimePicker.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { numberToLetter } from '$lib/utils/otherUtils';
	import { locations } from '$lib/utils/types';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import SeriesCard from './SeriesCard.svelte';

	let items = [
		{ id: 1, name: 'item1' },
		{ id: 2, name: 'item2' }
	];
	const flipDurationMs = 300;
	function handleDndChange(e: any) {
		items = e.detail.items;
	}
	function handleThing(name: string) {
		items = [...items, { id: items[items.length - 1].id + 1, name: name }];
		console.log('items', items);
	}
</script>

<div class="date-time-picker">
	From <TimePicker placeholder="HH:MM" />
	to <TimePicker placeholder="HH:MM" />
	on <DatePicker />
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
<Textarea id="notes" class="max-w-screen-sm" placeholder="Write other details here" />

<Button class="w-fit">Delete workout</Button>

<div class="workoutEditor">
	<div>
		<Button variant="outline" on:click={() => handleThing('Series')}>Add another Series</Button>
		<Button variant="outline" on:click={() => handleThing('Exercise')}>Add another Exercise</Button>
	</div>
	<div
		class="createdWorkout"
		use:dndzone={{ items, flipDurationMs }}
		on:consider={handleDndChange}
		on:finalize={handleDndChange}
	>
		{#each items as item, i (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<SeriesCard exercises={[]} name={numberToLetter(i + 1)} />
			</div>
		{/each}
	</div>
</div>

<style>
	.date-time-picker {
		width: fit-content;
		display: inline-flex;
		column-gap: 5px;
		align-items: center;
	}

	.workoutEditor {
		margin-top: 20px;
	}

	.createdWorkout {
		display: flex;
		flex-wrap: wrap;
		row-gap: 20px;
		column-gap: 20px;
	}
</style>
