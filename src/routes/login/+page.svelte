<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from '../formSchema';

	export let form: SuperValidated<FormSchema>;
</script>

<h1>Log in</h1>

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
	<Form.Button>Log in</Form.Button>
	<p />
	<a href="../signup">Sign up instead</a>
</Form.Root>
