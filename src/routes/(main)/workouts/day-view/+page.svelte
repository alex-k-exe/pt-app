<script lang="ts">
	import ActivityCard from '$lib/components/ActivityCard.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { dayjs } from '$lib/utils/dates';
	import { userTypes, validDate } from '$lib/utils/types';

	export let data;
	const date = dayjs(data.date);
	const workouts = data.workouts;
</script>

<a href={`/workouts?month=${date.format('MM-YYYY')}`}>
	<Button variant="outline">Go back to month view</Button>
</a>
{date.format('D MMMM YYYY')}

{#if data.userType === userTypes.TRAINER}
	<a href={`/editor/workout?date=${date.format(validDate.format)}`}
		><Button>Make a new workout</Button></a
	>
{/if}

<div class="flex flex-wrap">
	{#each workouts as workout}
		<ActivityCard activity={workout} userType={data.userType} />
	{/each}
</div>
