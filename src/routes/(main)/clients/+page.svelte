<script lang="ts">
	import ClientsTable from './ClientsTable.svelte';

	export let data;
</script>

<svelte:head>
	<title>Clients</title>
	<meta name="clients" content="View and manage your clients" />
</svelte:head>

<h1>Clients</h1>

<div class="container mx-auto py-10">
	<ClientsTable clients={data.clients} trainers={data.trainers} />
	<!-- generateId(6) for inviting client -->
</div>
