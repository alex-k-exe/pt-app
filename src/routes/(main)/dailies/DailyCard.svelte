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
		<Card.Title>{userType === userTypes.CLIENT ? daily.title : daily.clientsName}</Card.Title>
		<Card.Description
			>{userType === userTypes.CLIENT ? daily.clientsName : daily.title}</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-wrap gap-2">
			{#each Object.entries(activeDays) as [day, isActive]}
				<Button
					variant={isActive ? 'default' : 'outline'}
					size="icon"
					on:click={() => (activeDays[day] = !isActive)}>{day[0].toUpperCase()}</Button
				>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer class="flex gap-[5px]">
		<a href="/editor" style="padding-right: 10px">Edit</a>
		<form action="?edit">
			<input type="hidden" name="id" value={daily.id} />
			<input type="hidden" name="activeDays" value={activeDays} />
			<Button>Edit</Button>
		</form>
		<form action="?delete">
			<input type="hidden" name="id" value={daily.id} />
			<Button variant="outline">Delete</Button>
		</form>
	</Card.Footer>
</Card.Root>
