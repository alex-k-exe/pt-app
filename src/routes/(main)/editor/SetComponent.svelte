<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { SetInsert } from '$lib/drizzleTables';

	export let set: Omit<SetInsert, 'workoutId' | 'seriesId'>;
	export let comparisonSet: typeof set | null = null;

	// TODO: generalise this so the trainer can add custom props
	const setProps = ['reps', 'weight', 'duration', 'rpe'] as const;
</script>

<p>{set.exerciseName}</p>
<table>
	{#if comparisonSet}
		<tr>
			<th></th>
			<th>This workout</th>
			<th>Compared workout</th>
		</tr>
	{/if}
	{#each setProps as prop}
		<tr>
			<td>{prop[0].toUpperCase() + prop.slice(1)}</td>
			<td><Input value={set[prop]} /></td>
			{#if comparisonSet}
				<td><Input value={comparisonSet[prop]} /></td>
			{/if}
		</tr>
	{/each}
</table>
