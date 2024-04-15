<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import type { SuperForm } from 'sveltekit-superforms/client';

	export let form: SuperForm<
		{
			newEmail: string;
		},
		any
	>;

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/changeEmail" use:enhance>
	<Form.Field {form} name="newEmail">
		<Form.Control let:attrs>
			<Form.Label>New email</Form.Label>
			<Input {...attrs} placeholder="A new email" bind:value={$formData.newEmail} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Change email</Button>
</form>
