<script lang="ts">
	import type dayjs from 'dayjs';
	import Button from '../ui/button/button.svelte';
	import DayCell from './DayCell.svelte';

	const daysOfTheWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	] as const;
	export let month: dayjs.Dayjs[][];
</script>

<div class="month">
	{#each daysOfTheWeek as heading, headingIndex (headingIndex)}
		<div style={'grid-column:' + (headingIndex + 1) + ': grid-row: 1'}>
			{heading.substring(0, 3)}
		</div>
	{/each}
	{#each month as week, weekIndex (weekIndex)}
		{#each week as day, dayIndex (dayIndex)}
			<Button
				class="day"
				variant="ghost"
				style={'grid-column:' +
					(dayIndex + 1) +
					'; grid-row: ' +
					(weekIndex + 2) +
					'; width: 100%; height: 100%;'}
			>
				<DayCell {day} />
			</Button>
		{/each}
	{/each}
</div>

<style>
	.month {
		display: grid;
		margin-top: 10px;
		grid-template-rows: auto 1fr 1fr 1fr 1fr 1fr 1fr;
		height: 100%;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
	}
</style>
