<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { Exercise } from '$lib/drizzleTables';

	export let exercise: Exercise;
	export let comparisonExercise: Exercise;

	// TODO: generalise this so the trainer can add custom rows
	const exerciseProps = ['reps', 'weight', 'duration', 'rpe'] as const;
</script>

<p>{exercise.name}</p>
<table>
	{#if comparisonExercise !== null}
		<tr>
			<th></th>
			<th>This workout</th>
			<th>Compared workout</th>
		</tr>
	{/if}
	{#each exerciseProps as prop}
		<tr>
			<td>{prop[0].toUpperCase() + prop.slice(1)}</td>
			<td><Input value={exercise[prop]} /></td>
			{#if comparisonExercise !== null}
				<td><Input value={comparisonExercise[prop]} /></td>
			{/if}
		</tr>
	{/each}
</table>
