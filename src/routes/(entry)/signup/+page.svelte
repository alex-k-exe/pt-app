<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form);
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="signupToken">
		<Form.Control let:attrs>
			<Form.Label>Sign up token</Form.Label>
			<Input
				{...attrs}
				placeholder="A 6 digit code that your trainer should give you"
				bind:value={$formData.signupToken}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
