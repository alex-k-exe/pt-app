<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form, {
		dataType: 'json'
	});
	const { form: formData, enhance } = form;
</script>

<div class="inline-block">
	Your signup token is <b>{data.signupTokenId}.</b>
	<a href={`/signup?targetHref=${data.targetHref}`}><u>Change your token</u></a>
</div>

{#if data.trainer}
	Your trainer's email is <b>{data.trainer?.email}</b> and their name is <b>{data.trainer?.name}</b>
{/if}

<form method="POST" use:enhance>
	<input type="hidden" name="signupTokenId" value={data.signupTokenId} />
	<input type="hidden" name="targetHref" value={data.targetHref} />
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
			<Input {...attrs} type="email" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password.password">
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password.confirmPassword">
		<Form.Control let:attrs>
			<Form.Label>Confirm password</Form.Label>
			<div class="flex">
				<Input {...attrs} type={passwordInputType} />
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
