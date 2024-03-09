<script lang="ts">
	const urls = ['Workouts', 'Dailies', 'Clients', 'Chats', 'Settings'];
</script>

<div class="container">
	<enhanced:img src="$lib/assets/logo.png" alt="App logo" style="width: 50px" />
	{#each urls as url}
		<a href={'/' + url.toLowerCase()}>{url}</a>
	{/each}
</div>

<style>
	.container {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		min-height: 20%;
	}
</style>
