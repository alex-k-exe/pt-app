<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Activity } from '$lib/drizzleTables.ts';
	import { daysOfTheWeek, userTypes, type ObjectValues } from '$lib/utils/types/other.ts';

	export let daily: Activity & { activeDays: string; clientsName: string | null };
	export let userType: ObjectValues<typeof userTypes>;

	const activeDays = Object.fromEntries(daysOfTheWeek.map((day) => [day, false]));
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			>{userType === userTypes.CLIENT
				? `Title - ${daily.title}`
				: `Client - ${daily.clientsName}`}</Card.Title
		>
		<Card.Description
			>{userType === userTypes.CLIENT ? '' : `Title - ${daily.title}`}</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-wrap gap-2">
			{#each Object.entries(activeDays) as [day, isActive]}
				<Button variant={isActive ? 'default' : 'outline'} size="icon"
					>{day[0].toUpperCase()}</Button
				>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer class="flex gap-[5px]">
		<a
			href={`/editor/daily?dailyId=${daily.id}` +
				`&activeDays=${Object.values(activeDays)
					.map((active) => (active ? '1' : '0'))
					.join()}`}><Button>Edit</Button></a
		>
		<form method="POST">
			<input type="hidden" name="id" value={daily.id} />
			<Button variant="outline">Delete</Button>
		</form>
	</Card.Footer>
</Card.Root>
