<script lang="ts">
	import { userTypes } from '$lib/utils/types';
	import { CalendarDays, MessageCircle, Repeat, Settings, Users } from 'lucide-svelte';

	export let data;

	let urls = [
		{ name: 'Workouts', icon: CalendarDays },
		{ name: 'Dailies', icon: Repeat },
		{ name: 'Chats', icon: MessageCircle },
		{ name: 'Settings', icon: Settings }
	];
	if (data.userType === userTypes.TRAINER) {
		urls = [...urls.slice(0, 2), { name: 'Clients', icon: Users }, ...urls.slice(2)];
	}
</script>

<div class="container">
	<nav class="top-0 hidden bg-background md:flex">
		<img src="logo.png" alt="App logo" style="width: 50px" />
		{#each urls as { name: pathName }}
			<a
				href={'/' + pathName.toLowerCase()}
				class={data.pathName.startsWith('/' + pathName.toLowerCase()) ? 'text-red-500' : ''}
				>{pathName}</a
			>
		{/each}
	</nav>
	<slot />
	<p style="color: red">{data.error ?? ''}</p>
	<nav class="bottom-0 flex bg-background md:hidden">
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
		position: sticky;
		padding: 10px 0px 10px 0px;
	}
</style>
