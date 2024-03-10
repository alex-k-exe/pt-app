<script lang="ts">
	import type { Workout } from '$lib/db/workoutsTables';
	import type dayjs from 'dayjs';
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

	function createDayCellStyle(dayIndex: number, weekIndex: number) {
		let s = 'width: 100%; height: 100%';
		s += '; grid-column:' + (dayIndex + 1);
		s += '; grid-row: ' + (weekIndex + 2);
		return s;
	}
</script>

<div class="month">
	{#each daysOfTheWeek as heading, headingIndex (headingIndex)}
		<div style={'grid-column:' + (headingIndex + 1) + ': grid-row: 1; padding-bottom: 10px'}>
			<b>{heading.substring(0, 3)}</b>
		</div>
	{/each}
	<!-- <ContextMenu.Root>
		<ContextMenu.Trigger>Context menu</ContextMenu.Trigger>
		<ContextMenu.Content>
			<ContextMenu.Item>Profile</ContextMenu.Item>
			<ContextMenu.Item>Billing</ContextMenu.Item>
			<ContextMenu.Item>Team</ContextMenu.Item>
			<ContextMenu.Item>Subscription</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root> -->
	{#each month as week, weekIndex (weekIndex)}
		{#each week as day, dayIndex (dayIndex)}
			<div style={createDayCellStyle(dayIndex, weekIndex)}>
				<DayCell {day} />
			</div>
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
		align-items: start;
	}
</style>
