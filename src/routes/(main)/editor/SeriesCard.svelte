<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import type { Exercise } from '$lib/drizzleTables';
	import ExerciseComponent from './ExerciseComponent.svelte';

	export let name: string;
	export let exercises: Exercise[];

	const exampleExercise: Exercise = {
		id: 2,
		name: 'Run',
		workoutId: 'string',
		seriesId: 3,
		reps: 'A lot',
		weight: null,
		duration: 'string',
		rpe: 'Among us'
	};
</script>

<Card.Root class="w-fit">
	<Card.Header>
		<Card.Title class="flex w-fit items-center">Series {name}</Card.Title>
		<Card.Description class="flex w-fit items-center"
			>Repeat <Input placeholder="n" /> times
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#each exercises as exercise}
			<ExerciseComponent {exercise} comparisonExercise={exampleExercise} />
		{/each}
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>
