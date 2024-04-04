<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema.js';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;

	let passwordInputType: 'password' | '' = 'password';
</script>

<div class="inline-block">
	Your signup token is <b>{data.signupTokenId}.</b>
	<a href={`/signup?targetHref=${data.targetHref}`}>Change your token</a>
</div>

{#if data.trainer}
	Your trainer's email is <b>{data.trainer?.email}</b> and their name is <b>{data.trainer?.name}</b>
{/if}

<form method="POST" use:enhance>
	<input type="hidden" name="targetHref" value={data.targetHref} />
	<Form.Field {form} name="user.name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.user.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="user.email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.user.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="user.password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<div class="flex">
				<Input {...attrs} type={passwordInputType} bind:value={$formData.user.password} />
				<Button
					on:click={() => (passwordInputType = passwordInputType === 'password' ? '' : 'password')}
				>
					{#if passwordInputType === 'password'}
						<Eye />
					{:else}
						<EyeOff />
					{/if}
				</Button>
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button type="submit">Submit</Form.Button>
</form>

<a href={`/login?targetHref="${data.targetHref}"`}>Log in instead</a>
