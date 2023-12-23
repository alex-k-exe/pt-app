<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from '../formSchema';

	export let form: SuperValidated<FormSchema>;
</script>

<h1>Sign up</h1>

<Form.Root method="POST" {form} schema={formSchema} let:config>
	<Form.Field {config} name="username">
		<Form.Item>
			<Form.Label>Username</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="password">
		<Form.Item>
			<Form.Label>Password</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>Sign up</Form.Button>
	<p />
	<a href="../login">Log in instead</a>
</Form.Root>
