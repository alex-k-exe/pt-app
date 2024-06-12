<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Activity } from '$lib/drizzleTables';
	import { datesAreSameDay, dayjs } from '$lib/utils/dates';
	import { validDate } from '$lib/utils/types';

	export let day: dayjs.Dayjs;
	export let workouts: (Activity & { clientsName: string | null; date: dayjs.Dayjs, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs })[];
</script>

<a
	href={'/workouts/day-view?date=' + day.format(validDate.format)}
	class={datesAreSameDay(day, dayjs()) ? 'text-red-500' : ''}
>
	{day.format(day.date() === 1 ? 'MMM D' : 'D')}
</a>

{#if workouts.length > 1}
	{workouts.length} workouts
{:else}
	{#each workouts as workout}
		<a class="w-full" href={`/editor/workout?workoutId=${workout.id}`}>
			<Button variant="secondary" size="sm">
				{workout.clientsName ?? workout.title}: from {dayjs(workout.startTime).format('h:mm A')} to {dayjs(
					workout.endTime
				).format('h:mm A')}
			</Button>
		</a>
	{/each}
{/if}
