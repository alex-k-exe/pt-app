<script lang="ts">
	import FormPassword from '$lib/components/ui/FormPassword.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form, {
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	let passwordInputType: 'password' | '' = 'password';
	$formData.targetHref = data.targetHref;
	$formData.signupTokenId = data.signupTokenId;
</script>

<h2>Sign up</h2>

<div class="inline-block">
	Your signup token is <b>{data.signupTokenId}</b>.
	<a href={'/signup' + (data.targetHref ? `?targetHref=${data.targetHref}` : '')}
		><u>Change your token</u></a
	>.
</div>

{#if data.trainer}
	Your trainer's email is <b>{data.trainer?.email}</b> and their name is
	<b>{data.trainer?.name}.</b>.
{:else}
	You are a trainer.
{/if}

<form method="POST" use:enhance>
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
	<Form.Field {form} name="password.password">
		<FormPassword label="Pasword" bind:value={$formData.password.password} bind:passwordInputType />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password.confirmPassword">
		<FormPassword
			label="Confirm pasword"
			bind:value={$formData.password.confirmPassword}
			bind:passwordInputType
		/>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button type="submit">Submit</Form.Button>
</form>
