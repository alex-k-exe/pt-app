<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { createEventDispatcher } from 'svelte';
	import SetComponent from './SetComponent.svelte';
	import { handleAddSet, type FormSeries } from './schema';

	export let series: FormSeries;

	const dispatch = createEventDispatcher();
</script>

<Card.Root class="basis-full border-2 border-red-400 sm:basis-1/2 md:basis-1/3">
	<Card.Header>
		<Card.Description class="flex w-fit"
			>Repeat <Input bind:value={series.reps}  placeholder="n" /> times</Card.Description
		>
	</Card.Header>
	<Card.Content>
		{#each series.sets as set, i}
			<SetComponent
				bind:set
				on:delete={() => (series.sets = [...series.sets.slice(0, i), ...series.sets.slice(i + 1)])}
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
