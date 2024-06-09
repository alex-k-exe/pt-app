<script lang="ts">
	import FormPassword from '$lib/components/ui/FormPassword.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form, {
		dataType: 'json'
	});
	const { form: formData, enhance } = form;
</script>

<h2>Log in</h2>

<form method="POST" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input type="email" bind:value={$formData.email} {...attrs} class="w-fit" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			<FormPassword bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
