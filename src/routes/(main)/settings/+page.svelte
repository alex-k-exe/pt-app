<script lang="ts">
	import DestructiveButton from '$lib/components/DestructiveButton.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form/index.ts';
	import { Input } from '$lib/components/ui/input';
	import { userTypes } from '$lib/utils/types';
	import { superForm } from 'sveltekit-superforms';
	import UpdatePasswordForm from './UpdatePasswordForm.svelte';

	export let data;

	const emailForm = superForm(data.emailSchema);
	const { form: emailFormData, enhance } = emailForm;
	const nameForm = superForm(data.nameSchema);
	const { form: nameFormData } = nameForm;

	let deleteAccountForm: HTMLFormElement;
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="settings" content="Change your settings like the app theme" />
</svelte:head>

<div class="flex">
	<form method="POST" action="?/signout">
		<Button type="submit">Sign out</Button>
	</form>

	<form method="POST" action="?/deleteAccount" bind:this={deleteAccountForm}>
		<DestructiveButton
			triggerText="Delete your account"
			description={data.userType === userTypes.TRAINER
				? "This will also delete anything related to you or your clients' accounts"
				: ''}
			on:confirm={() => deleteAccountForm.requestSubmit()}
		/>
	</form>
</div>

<form method="POST" action="?/updateName" use:enhance class="flex place-items-center gap-2">
	Your current name is <b>{data.user.name}</b>
	<Form.Field form={nameForm} name="newName">
		<Form.Control let:attrs>
			<Input
				{...attrs}
				class="w-fit"
				placeholder="Input your new name"
				bind:value={$nameFormData.newName}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Change your name</Button>
</form>

<form method="POST" action="?/updateEmail" use:enhance class="mt-2 flex place-items-center gap-2">
	Your current email is<b>{data.user.email}</b>
	<Form.Field form={emailForm} name="newEmail">
		<Form.Control let:attrs>
			<Input
				{...attrs}
				class="w-fit"
				placeholder="Input your new email"
				bind:value={$emailFormData.newEmail}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Change your email</Button>
</form>

<UpdatePasswordForm schema={data.passwordSchema} />
