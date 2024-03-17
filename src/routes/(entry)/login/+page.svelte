<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<div>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			Logged in
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</span>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<Button on:click={() => signIn('google')}>Sign In with Google</Button>
	{/if}
</div>
