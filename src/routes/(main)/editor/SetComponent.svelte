<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input';
	import { createEventDispatcher } from 'svelte';
	import type { FormSet } from './schema';

	export let set: FormSet;

	const dispatch = createEventDispatcher();

	// TODO: generalise this so the trainer can add custom props
	const setProps = ['reps', 'weight', 'duration', 'rpe'] as const;
</script>

<Card.Root class="w-fit basis-full border-2 border-green-400 sm:basis-1/2 md:basis-1/3">
	<Card.Header>
		<div class="flex w-fit">
			Exercise: <Input bind:value={set.exerciseName} />
		</div>
	</Card.Header>
	<Card.Content>
		<table>
			{#each setProps as prop}
				<tr>
					<td>{prop[0].toUpperCase() + prop.slice(1)}</td>
					<td><Input bind:value={set[prop]} /></td>
				</tr>
			{/each}
		</table>
	</Card.Content>
	<Card.Footer>
		<Button variant="destructive" on:click={() => dispatch('delete')}>Delete</Button>
	</Card.Footer>
</Card.Root>
