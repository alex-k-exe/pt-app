<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Form from '$lib/components/ui/form/index.ts';
	import { Input } from '$lib/components/ui/input/index.js';
	import { resetMode, setMode } from 'mode-watcher';
	import { superForm } from 'sveltekit-superforms';
	import ChangeEmailForm from './ChangeEmailForm.svelte';

	export let data;

	const changePasswordForm = superForm(data.changePasswordForm);
	const { form: formData, enhance } = changePasswordForm;
	const changeEmailForm = superForm(data.changeEmailForm);
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="settings" content="Change your settings like the app theme" />
</svelte:head>

<form method="POST" action="?/signout">
	<Button type="submit">Sign out</Button>
</form>

<form method="POST" action="?/deleteAccount">
	<Button type="submit" variant="destructive">Delete your account</Button>
</form>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Change theme</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<ChangeEmailForm form={changeEmailForm} />

<form method="POST" action="?/changePassword" use:enhance>
	<div class="flex">
		<Form.Field form={changePasswordForm} name="oldPassword">
			<Form.Control let:attrs>
				<Form.Label>Old password</Form.Label>
				<Input {...attrs} placeholder="Your old password" bind:value={$formData.oldPassword} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={changePasswordForm} name="newPassword">
			<Form.Control let:attrs>
				<Form.Label>New password</Form.Label>
				<Input {...attrs} placeholder="Make it a good one!" bind:value={$formData.newPassword} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Button type="submit">Change password</Button>
</form>
