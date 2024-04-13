<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Activity, Workout } from '$lib/drizzleTables';
	import {
		dayOnlyFormat,
		timeOnlyFormat,
		userTypes,
		type ObjectValues
	} from '$lib/utils/types/other';
	import dayjs from 'dayjs';

	export let day: dayjs.Dayjs;
	export let workouts: (Workout & Activity & { clientsName: string | null })[] | null = null;
	if (workouts === null || workouts.length === 0) workouts = null;
	export let userType: ObjectValues<typeof userTypes>;
</script>

<a href={'/workouts/day-view?date=' + day.format(dayOnlyFormat)}>
	{day.format(day.date() === 1 ? 'MMM D' : 'D')}
</a>

{#if workouts === null}
	<p></p>
{:else if workouts.length > 3}
	{workouts} workouts
{:else}
	{#each workouts as workout}
		<a class="w-full" href={`/editor/workout?workoutId=${workout.activityId}`}>
			<Button variant="secondary" size="sm">
				{userType === userTypes.CLIENT ? workout.title : workout.clientsName}: from {dayjs(
					workout.startTime
				).format(timeOnlyFormat)} to {dayjs(workout.endTime).format(timeOnlyFormat)}
			</Button>
		</a>
	{/each}
{/if}
