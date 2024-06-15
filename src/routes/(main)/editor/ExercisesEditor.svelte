<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { handleDeleteElement, type FormSeries } from './schema';
	import SeriesComponent from './SeriesComponent.svelte';

	export let series: FormSeries[];
</script>

<Button
	variant="outline"
	on:click={() => (series = [...series, { index: series.length, reps: 1, sets: [] }])}
	>Add a series</Button
>
<div class="flex flex-wrap">
	{#each series as singleSeries, j}
		<SeriesComponent
			bind:series={singleSeries}
			on:delete={() => (series = handleDeleteElement(series, j))}
		/>
	{/each}
</div>
