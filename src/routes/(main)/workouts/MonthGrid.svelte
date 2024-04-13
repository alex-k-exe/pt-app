<script lang="ts">
	import type { Activity, Workout } from '$lib/drizzleTables';
	import { daysOfTheWeek, userTypes, type ObjectValues } from '$lib/utils/types/other';
	import type dayjs from 'dayjs';
	import DayCell from './DayCell.svelte';

	export let month: dayjs.Dayjs[][];
	export let workouts: (Activity & Workout & { clientsName: string | null })[];
	export let userType: ObjectValues<typeof userTypes>;
</script>

<div class="month">
	{#each Object.values(daysOfTheWeek) as heading, headingIndex (headingIndex)}
		<div style={'grid-column:' + (headingIndex + 1) + ': grid-row: 1; padding-bottom: 10px'}>
			<b>{heading.substring(0, 3)}</b>
		</div>
	{/each}
	{#each month as week, weekIndex (weekIndex)}
		{#each week as day, dayIndex (dayIndex)}
			<div class="h-full w-full" style={`grid-column: ${day.day()}; grid-row:${weekIndex + 2}`}>
				<DayCell
					{userType}
					workouts={workouts.filter((workout) => workout.date === day.toDate())}
					{day}
				/>
			</div>
		{/each}
	{/each}
</div>

<style>
	.month {
		display: grid;
		margin-top: 10px;
		grid-template-rows: auto repeat(6, 1fr);
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		align-items: start;
		height: 100%;
	}
</style>
