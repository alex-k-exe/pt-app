<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { User } from '$lib/drizzleTables';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import RemoveClientAction from './RemoveClientAction.svelte';
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
			cell: () => {
				return createRender(TransferClientAction, { trainers });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<!-- Honestly I don't know what any of this does, I just copy-pasted it from https://www.shadcn-svelte.com/docs/components/data-table -->
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
