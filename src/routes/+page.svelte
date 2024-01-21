<script>
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';

	import { io } from 'socket.io-client';

	const socket = io();

	socket.on('eventFromServer', (message) => {
		console.log(message);
	});
</script>

{#if $page.data.session?.user}
	<p>Signed in as {$page.data.session.user.email}</p>
	<button on:click={() => signOut}>Sign out</button>
	<img src="https://cdn.pixabay.com/photo/2017/08/11/19/36/vw-2632486_1280.png" alt="Sussy baka" />
{:else}
	<p>Not signed in.</p>
	<button on:click={() => signIn('google')}>Sign in</button>
{/if}
