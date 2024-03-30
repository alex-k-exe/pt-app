<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import dayjs from 'dayjs';

	export let data;
	let newDate = dayjs(data.date);
</script>

{newDate.format('D MMMM YYYY')}
<div class="workouts">
	{#each data.workouts as workout (workout.id)}
		<Card.Root>
			<Card.Header>
				<Card.Title
					>{dayjs(workout.startTimeDate).format('h:ma') +
						' to ' +
						dayjs(workout.endTimeDate).format('h:ma') +
						'\n'}
				</Card.Title>
				<Card.Description>{workout.title}</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Card Content</p>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
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
