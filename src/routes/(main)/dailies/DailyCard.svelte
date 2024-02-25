<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Workout } from '$lib/db/workoutsTables.ts';
	import { createEventDispatcher } from 'svelte';

	export let daily: Workout;
	export let clientName: string;

	const daysOfWeek = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday'
	] as const;
	const activeDays = Object.fromEntries(daysOfWeek.map((day) => [day, false]));

	const dispatch = createEventDispatcher();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{clientName}</Card.Title>
		<Card.Description>{daily.title}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div style="display: flex; flex-wrap: wrap; gap: 5px">
			{#each Object.entries(activeDays) as [day, isActive]}
				<Button
					variant={isActive ? 'default' : 'outline'}
					size="icon"
					on:click={() => (activeDays[day] = !isActive)}>{day[0].toUpperCase()}</Button
				>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer class="flex gap-[5px]">
		<a href="/editor">Edit</a>
		<Button variant="outline" on:click={() => dispatch('delete')}>Delete</Button>
	</Card.Footer>
</Card.Root>
