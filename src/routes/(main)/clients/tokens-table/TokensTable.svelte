<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { SignupToken } from '$lib/drizzleTables';
	import { createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import DeleteTokenAction from './DeleteTokenAction.svelte';

	export let signupTokens: SignupToken[];

	const table = createTable(readable(signupTokens));

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'Token ID'
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Delete',
			cell: ({ value }) => {
				return createRender(DeleteTokenAction, { signupTokenId: value.toString() });
			}
		})
	]);
</script>

<form method="POST" action="?/createToken" class="flex gap-4 pb-5 align-middle">
	<h2>Sign up tokens</h2>
	<Button type="submit">Create a new token</Button>
</form>
<DataTable {table} {columns} />

Give your client this link with the signup token at the end
<p></p>
<a href="https://pt-app.pages.dev/signup/"><u>https://pt-app.pages.dev/signup/</u></a>
