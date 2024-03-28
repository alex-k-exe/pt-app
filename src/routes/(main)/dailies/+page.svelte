<svelte:head>
	<title>Dailies</title>
	<meta name="dailies" content="View and manage recurring workouts" />
</svelte:head>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { type Workout } from '$lib/db/workoutsTables';
	import { LinkedList } from '$lib/utils/types';
	import DailyCard from './DailyCard.svelte';

	let color = 'black';

	function generateDaily(i: number): Workout {
		return {
			id: i.toString(),
			clientId: '283283',
			trainerId: '932302',
			title: 'Running',
			startTimeDate: null,
			endTimeDate: null,
			location: 'West End',
			remindMinsClient: null,
			remindMinsTrainer: null,
			notes: null,
			recurringDays: '0100110'
		};
	}

	let dailies = new LinkedList<Workout>();
	for (let i of [0, 1, 2, 3, 4]) {
		dailies.add(generateDaily(i));
	}
</script>

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
