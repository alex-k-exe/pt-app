<script lang="ts">
	import logo from '/logo.png';
	const urls = ['Workouts', 'Dailies', 'Clients', 'Chats', 'Settings'];
</script>

<div class="container">
	<img src={logo} alt="App logo" width="50px" />
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
