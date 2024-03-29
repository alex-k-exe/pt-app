<script lang="ts">
	import type { Workout } from '$lib/drizzleTables';
	import type dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import DayCell from './DayCell.svelte';

	export let month: dayjs.Dayjs[][];
	export let workouts: Workout[];

	const daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	] as const;

	function createDayCellStyle(day: Dayjs, workouts: Workout[]) {
		let s = 'width: 100%; height: 100%';
		// Adjusted to make Monday the first day of the week
		s += '; grid-column:' + day.day();
		return s;
	}
</script>

<div class="month">
	{#each daysOfTheWeek as heading, headingIndex (headingIndex)}
		<div style={'grid-column:' + (headingIndex + 1) + ': grid-row: 1; padding-bottom: 10px'}>
			<b>{heading.substring(0, 3)}</b>
		</div>
	{/each}
	{#each month as week, weekIndex (weekIndex)}
		{#each week as day, dayIndex (dayIndex)}
			<div style={createDayCellStyle(day, workouts) + '; grid-row:' + (weekIndex + 2)}>
				<DayCell {day} />
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
