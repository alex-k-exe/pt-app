<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import FormPassword from '$lib/components/ui/FormPassword.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.ts';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form);
	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="settings" content="Change your settings like the app theme" />
</svelte:head>

<form method="POST" action="?/signout">
	<Button type="submit">Sign out</Button>
</form>

<form method="POST" action="?/deleteAccount">
	<DestructiveButton
		triggerText="Delete your account"
		description="Delete your account and anything related to it or your clients' accounts"
	/>
</form>

<form
	<p>You current email is: {data.user.email}</p>
	<Form.Field {form} name="newEmail">
		<Form.Control let:attrs>
			<Form.Label>Your new email</Form.Label>
			<Input {...attrs} class="w-fit" bind:value={$formData.newEmail} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="oldPassword">
		<FormPassword label="Your old password" bind:value={$formData.oldPassword} />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<FormPassword label="Your new password" bind:value={$formData.newPassword} />
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Update profile</Button>
</form>
