<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Activity } from '$lib/drizzleTables.ts';
	import { daysOfTheWeek, userTypes, validActiveDays, type ObjectValues } from '$lib/utils/types';

	export let activity: Activity & { clientsName: string | null } & (
			| { activeDays: string }
			| { date: dayjs.Dayjs; startTime: dayjs.Dayjs; endTime: dayjs.Dayjs }
		);
	export let userType: ObjectValues<typeof userTypes>;

	// TODO: jank
	const activityType = 'activeDays' in activity ? 'daily' : 'workout';

	let activeDays: { day: string; isActive: boolean }[] = [];
	if ('activeDays' in activity) {
		if (!validActiveDays.test(activity.activeDays)) activity.activeDays = '0000000';
		activeDays = activity.activeDays.split('').map((activeDay, i) => {
			return { day: daysOfTheWeek[i], isActive: activeDay === '1' } as {
				day: string;
				isActive: boolean;
			};
		});
	}

	let form: HTMLFormElement;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title
			>{userType === userTypes.CLIENT ? `${activity.title}` : `${activity.clientsName}`}</Card.Title
		>
		<Card.Description>
			{userType === userTypes.CLIENT ? '' : `${activity.title}`}
			{activity.location ? ` - ${activity.location}` : ''}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-wrap gap-2">
			{#each activeDays as { day, isActive }}
				<Button variant={isActive ? 'default' : 'outline'} size="icon">{day.charAt(0)}</Button>
			{/each}
		</div>
	</Card.Content>
	<Card.Footer class="flex gap-[5px]">
		<form method="POST" bind:this={form}>
			<input type="hidden" name={`${activityType}Id`} value={activity.id} />
			<DestructiveButton
				triggerText={`Delete this ${activityType}`}
				on:confirm={() => form.requestSubmit()}
			/>
		</form>
		<a href={`/editor/${activityType}?${activityType}Id=${activity.id}`}>
			<Button>Edit</Button>
		</a>
	</Card.Footer>
</Card.Root>
