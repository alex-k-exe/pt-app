<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { dayjs } from '$lib/utils/dates';
	import { dayOnlyFormat, userTypes } from '$lib/utils/types/other.js';

	export let data;
	const date = dayjs(data.date);
	const workouts = data.workouts;

	function formatTime(date: Date) {
		let hours = date.getHours();
		let minutes: string | number = date.getMinutes();
		let amOrPm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours === 0 ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return hours + ':' + minutes + amOrPm;
	}
</script>

<a href="/workouts"><Button variant="outline">Go back to month view</Button></a>
{date.format('D MMMM YYYY')}

{#if data.userType === userTypes.TRAINER}
	<a href={`/editor/workout?date=${date.format(dayOnlyFormat)}`}
		><Button>Make a new workout</Button></a
	>
{/if}

<div class="workouts">
	{#each workouts as workout (workout.id)}
		<Card.Root>
			<Card.Header>
				<Card.Title
					>{'From ' +
						formatTime(workout.startTime) +
						' to ' +
						formatTime(workout.endTime)}</Card.Title
				>
				<Card.Description
					>{(workout.clientsName ? `${workout.clientsName} - ` : '') +
						workout.title}</Card.Description
				>
			</Card.Header>
			<Card.Content>
				Location - <p>{workout.location}</p>
			</Card.Content>
			<Card.Footer>
				<form method="POST" action="?/delete">
					<input type="hidden" value={workout.id} />
					<DestructiveButton triggerText="Delete" />
				</form>
				<a href={`/editor/workout?workoutId=${workout.id}`}>
					<Button type="submit">Edit</Button>
				</a>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

<style>
	.workouts {
		display: flex;
		flex-wrap: wrap;
	}
</style>
