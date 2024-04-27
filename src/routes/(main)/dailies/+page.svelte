<script lang="ts">
	import ActivityCard from '$lib/components/ActivityCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { userTypes } from '$lib/utils/types/other';

	export let data;
</script>

<svelte:head>
	<title>Dailies</title>
	<meta name="dailies" content="View and manage recurring workouts" />
</svelte:head>

<div class="inline-block">
	<h1>Dailies</h1>
	{#if data.userType === userTypes.TRAINER}
		<Button><a href="/editor/daily">New daily</a></Button>
	{/if}
</div>

<div class="dailies">
	{#each data.dailies as daily}
		<ActivityCard userType={data.userType} activity={daily} />
	{/each}
</div>

<style>
	.dailies {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
