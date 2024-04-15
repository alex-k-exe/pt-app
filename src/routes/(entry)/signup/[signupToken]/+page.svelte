<script lang="ts">
	import FormPassword from '$lib/components/ui/FormPassword.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form);
	const { form: formData, enhance } = form;

	let passwordInputType: 'password' | '' = 'password';
	$formData.targetPath = data.targetPath;
</script>

<h2>Sign up</h2>

<div class="inline-block">
	Your signup token is <b>{data.signupTokenId}</b>.
	<a href={'/signup' + (data.targetPath ? `?targetPath=${data.targetPath}` : '')}
		>You can <u>change your token</u></a
	>.
</div>

{#if data.trainer}
	Your trainer's email is <b>{data.trainer?.email}</b> and their name is
	<b>{data.trainer?.name}</b>.
{:else}
	You are a trainer.
{/if}

<form method="POST" use:enhance>
	<input type="hidden" name="trainerId" value={data.trainer?.id} />
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<FormPassword label="Password" bind:value={$formData.password} bind:passwordInputType />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<FormPassword
			label="Confirm pasword"
			bind:value={$formData.confirmPassword}
			bind:passwordInputType
		/>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button type="submit">Submit</Form.Button>
</form>
