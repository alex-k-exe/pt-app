<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { User } from '$lib/drizzleTables';
	import { createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import RemoveClientAction from './DeleteClientAction.svelte';
	import TransferClientAction from './TransferClientAction.svelte';

	export let clients: User[];
	export let trainers: User[];

	const table = createTable(readable(clients));
	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Remove',
			cell: ({ value }) => {
				return createRender(RemoveClientAction, { clientId: value });
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Transfer to another trainer',
			cell: ({ value }) => {
				return createRender(TransferClientAction, { clientId: value, trainers });
			}
		})
	]);
</script>

<h2>Clients</h2>
<DataTable {table} {columns} />
