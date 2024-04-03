<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
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
				return createRender(DeleteTokenAction, { signupTokenId: value });
			}
		})
	]);
</script>

<h2>Sign up tokens</h2>
<DataTable {table} {columns} />
