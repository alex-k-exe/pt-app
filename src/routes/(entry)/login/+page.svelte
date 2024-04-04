<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from '../signup/[signupToken]/schema.js';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="user.email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input type="email" bind:value={$formData.user.email} {...attrs} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="user.password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" bind:value={$formData.user.password} {...attrs} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

<!-- implement forgot password and login throttling -->
