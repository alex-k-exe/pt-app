<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Activity } from '$lib/drizzleTables.ts';
	import {
		daysOfTheWeek,
		userTypes,
		validActiveDays,
		type ObjectValues
	} from '$lib/utils/types/other.ts';

	export let daily: Activity & { activeDays: string; clientsName: string | null };
	export let userType: ObjectValues<typeof userTypes>;

	if (!daily.activeDays.match(validActiveDays)) daily.activeDays = '0000000';
	const activeDays = daily.activeDays.split('').map((activeDay, i) => {
		return { day: daysOfTheWeek[i], isActive: activeDay === '1' } as {
			day: string;
			isActive: boolean;
		};
	});
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
			{#each activeDays as { day, isActive }}
				<Button variant={isActive ? 'default' : 'outline'} size="icon">{day.charAt(0)}</Button>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer class="flex gap-[5px]">
		<form method="POST">
			<input type="hidden" name="dailyId" value={daily.id} />
			<Button variant="destructive" type="submit">Delete</Button>
		</form>
		<a href={`/editor/daily?dailyId=${daily.id}`}><Button>Edit</Button></a>
	</Card.Footer>
</Card.Root>
