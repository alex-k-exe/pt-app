<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { getDaysForCalendar } from '$lib/utils/dates';
	import { months, type ObjectValues } from '$lib/utils/types/other.js';
	import dayjs from 'dayjs';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { z } from 'zod';
	import MonthGrid from './MonthGrid.svelte';

	export let data;

	let year = data.month.getFullYear();
	const yearSchema = z.number().int().positive().gt(1950).lt(3000);
	function handleChangeYear(newValue: unknown) {
		const validated = yearSchema.safeParse(newValue);
		if (validated.success) year = validated.data;
	}

	let searchClientForm: HTMLFormElement;
	let selectedClient: { id: string; name: string } | null = null;

	let changeMonthForm: HTMLFormElement;
	let selectedMonth: ObjectValues<typeof months> = dayjs(data.month).format('MMMM') as ObjectValues<
		typeof months
	>;
</script>

<svelte:head>
	<title>Workouts</title>
	<meta name="workouts" content="View and manage one-time workouts" />
</svelte:head>

<div class="buttons">
	{#if data.trainersClients !== null && data.trainersClients.length > 0}
		<form method="POST" action="?/searchForClient" bind:this={searchClientForm}>
			<Select.Root
				selected={{ value: selectedClient?.id, label: selectedClient?.name }}
				onSelectedChange={(event) => {
					if (!event || !event.value || !event.label) return;
					selectedClient = { id: event.value, name: event.label };
					searchClientForm.requestSubmit();
				}}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select a client" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each data.trainersClients as client}
							<Select.Item value={client.id} label={client.name}>{client.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="clientId" />
			</Select.Root>
		</form>
	{/if}
	<form method="POST" action="?/previousMonth">
		<Button type="submit" variant="outline" size="icon" style="margin-left: 2%">
			<ChevronLeft />
		</Button>
	</form>
	<form method="POST" action="?/changeMonth" bind:this={changeMonthForm}>
		<Select.Root
			selected={{ value: selectedMonth, label: selectedMonth }}
			onSelectedChange={(event) => {
				console.log('here bitch');
				console.log(selectedMonth);
				if (!event || !event.value) return;
				selectedMonth = event.value;
				changeMonthForm.requestSubmit();
			}}
		>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Select a month" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each Object.values(months) as month}
						<Select.Item value={month} label={month}>{month}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="newMonth" value={selectedMonth} />
		</Select.Root>
	</form>
	<form method="POST" action="?/nextMonth">
		<Button type="submit" variant="outline" size="icon" style="margin-right: 2%">
			<ChevronRight />
		</Button>
	</form>
	<form class="hidden md:inline" method="POST" action="?/changeYear">
		<Input
			placeholder="Year"
			style="margin-right: 2%"
			name="newYear"
			bind:value={year}
			on:change={(newValue) => handleChangeYear(newValue)}
		/>
	</form>
	<form method="post" action="?/today">
		<Button type="submit">Today</Button>
	</form>
</div>

<MonthGrid
	userType={data.userType}
	month={getDaysForCalendar(dayjs().month())}
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
