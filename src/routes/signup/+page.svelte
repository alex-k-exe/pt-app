<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { formSchema } from '../formSchema';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Sign up</h1>

{#await data.form then form}
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
{:catch error}
	<p>{error.message}</p>
{/await}
