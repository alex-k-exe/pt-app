<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import dayjs from 'dayjs';

	export let data;
	console.log('date', data.date);
	let newDate = dayjs(data.date);

	data.workouts = [
		{
			title: 'Morning Strength Training',
			id: 'workout-123',
			location: 'Gym',
			notes: 'Focus on compound lifts',
			clientId: 'client-456',
			trainerId: 'trainer-789',
			startTimeDate: '2023-04-01T08:00:00Z',
			endTimeDate: '2023-04-01T10:00:00Z',
			recurringDays: ''
		},
		{
			title: 'Afternoon Strength Training',
			id: 'workout-123',
			location: 'Gym',
			notes: 'Focus on compound lifts',
			clientId: 'client-456',
			trainerId: 'trainer-789',
			startTimeDate: '2023-04-01T08:00:00Z',
			endTimeDate: '2023-04-01T10:00:00Z',
			recurringDays: ''
		}
	];
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
