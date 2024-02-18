<script>
	import DailyCard from './DailyCard.svelte';
</script>

<div class="header">
	<h1>Dailies</h1>
	<Button>New daily</Button>
</div>

<div class="dailies">
	{#each [1, 2, 3, 4, 5] as { }}
		<DailyCard {'Alex'} title={'Running'} />
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
