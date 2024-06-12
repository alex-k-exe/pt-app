<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { dayjs, getDaysForCalendar } from '$lib/utils/dates';
	import { months, validMonthDate } from '$lib/utils/types';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import MonthGrid from './MonthGrid.svelte';

	export let data;

	const monthString =
		dayjs(data.month).month() === dayjs().month()
			? ''
			: `?month=${dayjs(data.month).format(validMonthDate.format)}`;
</script>

<svelte:head>
	<title>Workouts</title>
	<meta name="workouts" content="View and manage one-time workouts" />
</svelte:head>

<div class="buttons">
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
					<a href={`/workouts${monthString}`}>
						<Select.Item value="" label="Select all clients">Select all clients</Select.Item>
					</a>
					{#each data.clients as client}
						<a href={`/workouts?clientId=${client.id}&month=${monthString}`}>
							<Select.Item value={client.id} label={client.name}>
								{client.name}
							</Select.Item>
						</a>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	{/if}
	<a
		href={`/workouts?month=${dayjs(data.month).subtract(1, 'month').format('MM-YYYY')}` +
			(data.selectedClientId ? `&clientId=${data.selectedClientId}` : '')}
	>
		<Button variant="outline" size="icon" style="margin-left: 2%">
			<ChevronLeft />
		</Button>
	</a>
	<Select.Root
		selected={{
			value: dayjs(data.month).format('MMMM'),
			label: dayjs(data.month).format('MMMM')
		}}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a month" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each Object.values(months) as month}
					<a
						href={`/workouts?month=${dayjs(month, 'MMMM').format('MM')}-${data.month.getFullYear()}` +
							(data.selectedClientId ? `&clientId=${data.selectedClientId}` : '')}
					>
						<Select.Item value={month} label={month}>
							{month}
						</Select.Item>
					</a>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<a
		href={`/workouts?month=${dayjs(data.month).add(1, 'month').format('MM-YYYY')}` +
			(data.selectedClientId ? `&clientId=${data.selectedClientId}` : '')}
	>
		<Button variant="outline" size="icon" style="margin-right: 2%">
			<ChevronRight />
		</Button>
	</a>
	<form class="hidden md:inline" method="POST" action="?/changeYear">
		<Input
			name="newYear"
			class="w-fit"
			placeholder="Year"
			style="margin-right: 2%"
			value={data.month.getFullYear()}
		/>
	</form>
	<a href={'/workouts' + (data.selectedClientId ? `?clientId=${data.selectedClientId}` : '')}
		><Button>Today</Button></a
	>
</div>

<MonthGrid
	month={getDaysForCalendar(data.month.getMonth(), data.month.getFullYear())}
	workouts={data.workouts}
/>

<style>
	.buttons {
		display: flex;
		margin: 5px 10px 5px 10px;
		column-gap: 10px;
		align-self: center;
	}
</style>
