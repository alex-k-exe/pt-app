<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { signupTokenSchema } from './schema.js';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(z.object({ signupToken: signupTokenSchema }))
	});

	const { form: formData, enhance } = form;
	console.log('finished');
</script>

<h2>Sign up</h2>

<form method="POST" use:enhance>
	<Form.Field {form} name="signupToken">
		<Form.Control let:attrs>
			<Form.Label>Signup token</Form.Label>
			<Input {...attrs} bind:value={$formData.signupToken} />
		</Form.Control>
		<Form.Description>A 6 digit code that your trainer should give you</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

{data.asyncValidationError ?? ''}
