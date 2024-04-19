<script lang="ts">
	import SelectClient from '$lib/components/SelectClient.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { getDaysForCalendar } from '$lib/utils/dates';
	import { dayOnlyFormat, months, type ObjectValues } from '$lib/utils/types/other.js';
	import dayjs from 'dayjs';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { afterUpdate } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import MonthGrid from './MonthGrid.svelte';
	import { yearSchema } from './schema.js';

	export let data;

	const changeYearForm = superForm(data.changeYearForm, {
		validators: zodClient(yearSchema)
	});
	const { form: yearFormData, enhance } = changeYearForm;

	let selectedClient: { id: string; name: string } | null = null;
	let selectClientForm: HTMLFormElement;

	let selectedMonth = dayjs(data.month).format('MMMM') as ObjectValues<typeof months>;
	let changeMonthForm: HTMLFormElement;

	afterUpdate(() => {
		$yearFormData.newYear = data.month.getFullYear();
	});
</script>

<svelte:head>
	<title>Workouts</title>
	<meta name="workouts" content="View and manage one-time workouts" />
</svelte:head>

<div class="buttons">
	{#if data.clients !== null && data.clients.length > 0}
		<form
			method="POST"
			action="?/selectClient"
			use:enhance
			class="flex"
			bind:this={selectClientForm}
		>
			<input type="hidden" value={selectedClient?.id ?? ''} name="clientId" />
			<SelectClient
				{selectedClient}
				afterOnSelectedChange={() => {
					console.log('select');
					selectClientForm.requestSubmit();
				}}
				clients={data.clients}
			/>
		</form>
		<a href={`/workouts?month=${dayjs(data.month).format('MM-YYYY')}`}
			><Button>Search all clients</Button></a
		>
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
	<form class="hidden md:inline" method="POST" action="?/changeYear" use:enhance>
		<Form.Field form={changeYearForm} name="newYear">
			<Form.Control let:attrs>
				<Input
					{...attrs}
					class="w-fit"
					placeholder="Year"
					style="margin-right: 2%"
					bind:value={$yearFormData.newYear}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</form>
	<form method="POST" action="?/today">
		<Button type="submit">Today</Button>
	</form>
</div>

<MonthGrid
	month={getDaysForCalendar(dayjs(data.month, dayOnlyFormat).month())}
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
