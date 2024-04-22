<script lang="ts">
	import ClientsTable from './clients-table/ClientsTable.svelte';
	import TokensTable from './tokens-table/TokensTable.svelte';

	export let data;
</script>

<svelte:head>
	<title>Clients</title>
	<meta name="clients" content="Manage your clients and invite links" />
</svelte:head>

<h1>Clients and signup tokens</h1>

<div class="flex w-full flex-row justify-around gap-10">
	<div class="w-full">
		<ClientsTable clients={data.clients} trainers={data.trainers} />
	</div>
	<div class="w-full">
		<TokensTable signupTokens={data.signupTokens} />
	</div>
</div>
