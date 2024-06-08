<script lang="ts">
	import FormPassword from '$lib/components/ui/FormPassword.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index';
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import { passwordSchema } from './schema';

	// TODO: make a better name for schema, it's usually called data.form
	type Schema = z.infer<Awaited<ReturnType<typeof passwordSchema>>>;
	export let schema: SuperValidated<Schema, any, Schema>;
	const form = superForm(schema);
	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/updatePassword" use:enhance class="mt-4">
	<h2>Change your password</h2>
	<Form.Field {form} name="oldPassword">
		<FormPassword label="Your old password" bind:value={$formData.oldPassword} />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<FormPassword label="Your new password" bind:value={$formData.newPassword} />
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Update password</Button>
</form>
