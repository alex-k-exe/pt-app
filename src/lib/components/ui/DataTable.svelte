<script lang="ts">
	import * as Table2 from '$lib/components/ui/table';
	import { Render, Subscribe, Table } from 'svelte-headless-table';

	export let table: Table<any, any>;
	export let columns;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table2.Root {...$tableAttrs}>
		<Table2.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table2.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table2.Head {...attrs}>
									<Render of={cell.render()} />
								</Table2.Head>
							</Subscribe>
						{/each}
					</Table2.Row>
				</Subscribe>
			{/each}
		</Table2.Header>
		<Table2.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table2.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table2.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table2.Cell>
							</Subscribe>
						{/each}
					</Table2.Row>
				</Subscribe>
			{/each}
		</Table2.Body>
	</Table2.Root>
</div>
