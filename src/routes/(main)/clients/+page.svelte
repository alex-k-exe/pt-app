<script lang="ts">
	import ClientsTable from './ClientsTable.svelte';
</script>

<svelte:head>
	<title>Clients</title>
	<meta name="clients" content="View and manage your clients" />
</svelte:head>

<h1>Clients</h1>

<div class="container mx-auto py-10">
	<ClientsTable />
</div>

// TODO https://www.shadcn-svelte.com/docs/components/data-table#sorting
