<script lang="ts">
	import ClientsTable from './clients-table/ClientsTable.svelte';

	export let data;
</script>

<svelte:head>
	<title>Clients</title>
	<meta name="clients" content="Manage your clients and invite links" />
</svelte:head>

<h1>Clients and invite links</h1>

<div class="">
	<ClientsTable clients={data.clients} trainers={data.trainers} />
	<!-- for inviting client, token should be 6 integers and hashed before storing in db -->
</div>
