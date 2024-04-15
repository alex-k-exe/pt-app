<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DailyCard from './DailyCard.svelte';

	export let data;
</script>

<svelte:head>
	<title>Dailies</title>
	<meta name="dailies" content="View and manage recurring workouts" />
</svelte:head>

<div class="inline-block">
	<h1>Dailies</h1>
	<Button><a href="/editor/daily">New daily</a></Button>
</div>

<div class="dailies">
	{#each data.dailies as daily}
		<DailyCard userType={data.userType} {daily} />
	{/each}
</div>

<style>
	.dailies {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
