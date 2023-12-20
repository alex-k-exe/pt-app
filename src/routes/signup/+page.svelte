<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { PageData } from './$types';
	import { formSchema } from './schema';

	export let data: PageData;
</script>

{#await data.form then form}
	<Form.Root method="POST" {form} schema={formSchema} let:config>
		<Form.Field {config} name="username">
			<Form.Item>
				<Form.Label>Username</Form.Label>
				<Form.Input />
				<Form.Description>This is your public display name.</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</Form.Root>
{:catch error}
	<p>{error.message}</p>
{/await}
