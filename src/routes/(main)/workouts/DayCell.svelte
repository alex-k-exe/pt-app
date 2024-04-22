<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Activity } from '$lib/drizzleTables';
	import { datesAreSameDay, dayjs } from '$lib/utils/dates';
	import { dayOnlyFormat, timeOnlyFormat } from '$lib/utils/types/other';

	export let day: dayjs.Dayjs;
	export let workouts: (Activity & { clientsName: string | null; date: Date })[];
</script>

<a
	href={'/workouts/day-view?date=' + day.format(dayOnlyFormat)}
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
				{workout.clientsName ?? workout.title}: from {dayjs(workout.startTime).format(
					timeOnlyFormat
				)} to {dayjs(workout.endTime).format(timeOnlyFormat)}
			</Button>
		</a>
	{/each}
{/if}
