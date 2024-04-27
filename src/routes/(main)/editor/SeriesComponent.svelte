<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { numberToLetter } from '$lib/utils/other';
	import { createEventDispatcher } from 'svelte';
	import SetComponent from './SetComponent.svelte';
	import { handleAddSet, handleDeleteElement, type FormSeries } from './schema';

	export let series: FormSeries;

	const dispatch = createEventDispatcher();
</script>

<Card.Root class="basis-full border-2 border-red-400 sm:basis-1/2 md:basis-1/3">
	<Card.Header>
		<Card.Title>Series {numberToLetter(series.index + 1)}</Card.Title>
		<Card.Description class="flex w-fit"
			>Repeat <Input placeholder="n" bind:value={series.reps} /> times</Card.Description
		>
	</Card.Header>
	<Card.Content>
		{#each series.sets as set, j}
			<SetComponent
				bind:set
				on:delete={() => (series.sets = handleDeleteElement(series.sets, j))}
			/>
		{/each}
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="destructive" on:click={() => dispatch('delete')}>Delete</Button>
		<Button variant="outline" on:click={() => (series.sets = handleAddSet(series.sets))}
			>Add an exercise</Button
		>
	</Card.Footer>
</Card.Root>
