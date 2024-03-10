<script lang="ts">
	import MonthGrid from '$lib/components/calendar/MonthGrid.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Select from '$lib/components/ui/select';
	import { getDaysForCalendar } from '$lib/utils/dates';
	import dayjs from 'dayjs';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const viewOptions = {
		week: 'Week',
		month: 'Month'
	} as const;
</script>

<div class="buttons">
	<Input placeholder="Client's name" />
	<Button variant="outline" size="icon" style="margin-left: 3vh">
		<ChevronLeft />
	</Button>
	<Input placeholder="Month" />
	<Button variant="outline" size="icon" style="margin-right: 3vh">
		<ChevronRight />
	</Button>
	<Input placeholder="Year" style="margin-right: 3vh" class="hidden md:block" />
	<Button>Today</Button>
	<Select.Root onSelectedChange={() => {}}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="View" />
		</Select.Trigger>
		<Select.Content>
			{#each Object.entries(viewOptions) as [value, label]}
				<Select.Item {value} {label}>{label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>

<MonthGrid month={getDaysForCalendar(dayjs().month())} workouts={[]} />

<style>
	.buttons {
		display: flex;
		margin: 5px 10px 5px 10px;
		column-gap: 10px;
		align-self: center;
	}
</style>
