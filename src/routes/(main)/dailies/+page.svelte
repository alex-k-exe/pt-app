<script>
	import { Button } from '$lib/components/ui/button';
	import DailyCard from './DailyCard.svelte';

	let color = 'black';
</script>

<div class="header">
	<h1 style={'color:' + color}>Dailies</h1>
	<Button>New daily</Button>
</div>

<div class="dailies">
	{#each [1, 2, 3, 4, 5] as { }}
		<DailyCard
			clientName={'Alex'}
			title={'Running'}
			on:delete={() => (color = 'red')}
			on:edit={() => {
				color = 'blue';
			}}
		/>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
