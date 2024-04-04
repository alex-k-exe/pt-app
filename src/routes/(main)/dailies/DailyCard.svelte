<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Activity } from '$lib/drizzleTables.ts';
	import { UserType } from '$lib/utils/types/other.ts';

	export let daily: Activity & { activeDays: string; otherPersonsName: string };
	export let userType: keyof typeof UserType;

	const daysOfWeek = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday'
	] as const;
	const activeDays = Object.fromEntries(daysOfWeek.map((day) => [day, false]));
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{userType === UserType.CLIENT ? daily.title : daily.otherPersonsName}</Card.Title>
		<Card.Description
			>{userType === UserType.CLIENT ? daily.otherPersonsName : daily.title}</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<div style="display: flex; flex-wrap: wrap; gap: 5px">
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
