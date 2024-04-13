<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { getDaysForCalendar } from '$lib/utils/dates';
	import { months } from '$lib/utils/types/other';
	import dayjs from 'dayjs';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Svelecte from 'svelecte';
	import { z } from 'zod';
	import MonthGrid from './MonthGrid.svelte';

	export let data;
	let year = data.month.getFullYear();
	const yearSchema = z.number().int().positive().gt(1950).lt(3000);

	function handleChangeYear(newValue: unknown) {
		const validated = yearSchema.safeParse(newValue);
		if (validated.success) year = validated.data;
	}
</script>

<svelte:head>
	<title>Workouts</title>
	<meta name="workouts" content="View and manage one-time workouts" />
</svelte:head>

<div class="buttons">
	<form method="POST" action="?/searchForClient">
		<Svelecte
			options={data.workouts}
			valueField="clientId"
			labelField="clientsName"
			name="clientId"
		/>
	</form>
	<form method="POST" action="?/previousMonth">
		<Button variant="outline" size="icon" style="margin-left: 2%">
			<ChevronLeft />
		</Button>
	</form>
	<form method="POST" action="?/changeMonth">
		<Svelecte options={Object.values(months)} name="newMonth" />
	</form>
	<form method="POST" action="?/nextMonth">
		<Button variant="outline" size="icon" style="margin-right: 2%">
			<ChevronRight />
		</Button>
	</form>
	<form class="hidden md:inline" method="POST" action="?/changeYear">
		<Input
			placeholder="Year"
			style="margin-right: 2%"
			bind:value={year}
			on:change={(newValue) => handleChangeYear(newValue)}
		/>
	</form>
	<form method="post" action="?/today"><Button>Today</Button></form>
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
