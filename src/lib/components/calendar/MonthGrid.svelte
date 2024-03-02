<script lang="ts">
	import dayjs from 'dayjs';
	import Day from './DayCell.svelte';

	export let month: dayjs.Dayjs[][];
</script>

<div class="month">
	{#each month as week, weekIndex (weekIndex)}
		{#each week as day, dayIndex (dayIndex)}
			<div class="day" style={'grid-column: ' + (dayIndex + 1) + '; grid-row: ' + (weekIndex + 1)}>
				<Day {day} />
			</div>
		{/each}
	{/each}
</div>

<style>
	.month {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(5, 1fr);
	}

	.day {
		text-align: center;
		border: 1px black solid;
	}
</style>
