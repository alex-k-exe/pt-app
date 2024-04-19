<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { handleAddSet, handleDeleteElement, type FormSeries, type FormSet } from './schema';
	import SeriesComponent from './SeriesComponent.svelte';
	import SetComponent from './SetComponent.svelte';

	export let series: FormSeries[];
	export let sets: FormSet[];
</script>

<div class="workoutEditor">
	<div>
		<Button
			variant="outline"
			on:click={() => (series = [...series, { index: series.length, reps: 1, sets: [] }])}
			>Add a series</Button
		>
		<Button variant="outline" on:click={() => (sets = handleAddSet(sets))}>Add an exercise</Button>
	</div>
	<div class="flex flex-wrap">
		{#each series as singleSeries, j}
			<SeriesComponent
				bind:series={singleSeries}
				on:delete={() => (series = handleDeleteElement(series, j))}
			/>
		{/each}
		{#each sets as set, j}
			<SetComponent bind:set on:delete={() => (sets = handleDeleteElement(sets, j))} />
		{/each}
	</div>
</div>
