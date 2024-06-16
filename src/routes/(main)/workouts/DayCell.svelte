<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Activity } from '$lib/drizzleTables';
	import { datesAreSameDay, dayjs } from '$lib/utils/dates';
	import { validDate } from '$lib/utils/types';

	export let day: dayjs.Dayjs;
	export let workouts: (Activity & {
		clientsName: string | null;
		date: string;
		startTime: string;
		endTime: string;
	})[];
</script>

<a
	href={'/workouts/' + day.format(validDate.format)}
	class={datesAreSameDay(day, dayjs()) ? 'text-red-500' : ''}
>
	<p>{day.format(day.date() === 1 ? 'MMM D' : 'D')}</p>
</a>

{#if workouts.length > 1}
	<p class="text-sm">{workouts.length} workouts</p>
{:else}
	{#each workouts as workout}
		<a class="w-full" href={`/editor/workout?workoutId=${workout.id}`}>
			<Button variant="secondary" class="h-fit w-fit text-sm">
				{workout.clientsName
					? `${workout.clientsName} - `
					: `${workout.startTime} to ${workout.endTime}`}
				{workout.title}
			</Button>
		</a>
	{/each}
{/if}
