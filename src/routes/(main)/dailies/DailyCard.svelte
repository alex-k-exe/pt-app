<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let { clientName, title } = $props();

	type Weekday = {
		initial: string;
		doDailyOnThisDay?: boolean;
	};
	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	let activeDays: Weekday[] = $state(
		Array.from({ length: 7 }, (_, index) => ({ initial: weekdays[index], doDailyOnThisDay: false }))
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{clientName}</Card.Title>
		<Card.Description>{title}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div style="display: flex; flex-wrap: wrap; gap: 5px">
			{#each activeDays as day}
				<Button
					variant={day.doDailyOnThisDay ? 'default' : 'outline'}
					size="icon"
					onclick={() => (day.doDailyOnThisDay = !day.doDailyOnThisDay)}>{day.initial}</Button
				>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer class="flex gap-[5px]">
		<Button variant="outline" onclick={() => dispatch('edit')}>Edit</Button>
		<Button variant="outline" onclick={() => dispatch('delete')}>Delete</Button>
	</Card.Footer>
</Card.Root>
