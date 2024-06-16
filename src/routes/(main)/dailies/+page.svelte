<script lang="ts">
	import ActivityCard from '$lib/components/ActivityCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import { userTypes } from '$lib/utils/types';

	export let data;
</script>

<svelte:head>
	<title>Dailies</title>
	<meta name="dailies" content="View and manage recurring dailies" />
</svelte:head>

<div class="inline-block">
	<h1>Dailies</h1>
	{#if data.userType === userTypes.TRAINER}
		<Button><a href="/editor/daily">New daily</a></Button>
	{/if}
</div>

{#if data.clients}
	<Select.Root
		selected={{
			value: data.selectedClientId ?? '',
			label:
				data.clients.find((client) => client.id === data.selectedClientId)?.name ??
				'Select all clients'
		}}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select all clients" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<a href={`/dailies`}>
					<Select.Item value="" label="Select all clients">Select all clients</Select.Item>
				</a>
				{#each data.clients as client}
					<a href={`/dailies?clientId=${client.id}`}>
						<Select.Item value={client.id} label={client.name}>
							{client.name}
						</Select.Item>
					</a>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
{/if}

<div class="dailies">
	{#each data.dailies as daily}
		<ActivityCard userType={data.userType} activity={daily} />
	{/each}
</div>

<style>
	.dailies {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
