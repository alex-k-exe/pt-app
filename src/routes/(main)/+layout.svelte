<script lang="ts">
	import { CalendarDays, MessageCircle, Repeat, Settings, Users } from 'lucide-svelte';

	const urls = [
		{ name: 'Workouts', icon: CalendarDays },
		{ name: 'Dailies', icon: Repeat },
		{ name: 'Clients', icon: Users },
		{ name: 'Chats', icon: MessageCircle },
		{ name: 'Settings', icon: Settings }
	];
</script>

<div class="container">
	<nav class="hidden md:flex">
		<enhanced:img src="$lib/assets/logo.png" alt="App logo" style="width: 50px" />
		{#each urls as { name }}
			<a href={'/' + name.toLowerCase()}>{name}</a>
		{/each}
	</nav>
	<slot />
	<nav class="flex md:hidden">
		{#each urls as { name, icon }}
			<a href={'/' + name.toLowerCase()}>
				<svelte:component this={icon} />
			</a>
		{/each}
	</nav>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 0px;
	}

	nav {
		justify-content: space-evenly;
		align-items: center;
		height: 15vh;
	}
</style>
