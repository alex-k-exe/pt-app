<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { type Daily } from '$lib/drizzleTables.ts';
	import { createExampleActivity } from '$lib/utils/other';
	import { LinkedList } from '$lib/utils/types/linkedList';
	import DailyCard from './DailyCard.svelte';

	let color = 'black';

	let dailies = new LinkedList<Daily>();
	for (let i of [0, 1, 2, 3, 4]) {
		dailies.add(createExampleActivity());
	}
</script>

<svelte:head>
	<title>Dailies</title>
	<meta name="dailies" content="View and manage recurring workouts" />
</svelte:head>

<div class="header">
	<h1 style={'color:' + color}>Dailies</h1>
	<Button>New daily</Button>
</div>

<div class="dailies">
	{#each dailies.getArray().map((node) => node.value) as daily (daily.id)}
		<DailyCard
			{daily}
			clientName={'Alex'}
			on:delete={() => dailies.remove((node) => node.id === daily.id)}
			on:edit={() => {
				color = 'blue';
			}}
		/>
	{/each}
</div>

<style>
	.dailies {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
