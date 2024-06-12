<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { dayjs } from '$lib/utils/dates';
	import { validTime } from '$lib/utils/types';
	import z from 'zod';
	import Input from './ui/input/input.svelte';

	export let selectedTimeString = dayjs().format(validTime);
	let selectedTimeDayjs = dayjs(selectedTimeString, validTime);

	const AmOrPm = {
		AM: 'AM',
		PM: 'PM'
	} as const;
	const hourSchema = z.number().min(0).max(12);
	const minutesSchema = z.number().min(0).max(59);

	let inputHours = selectedTimeDayjs.hour() % 12;
	let inputMinutes = selectedTimeDayjs.minute();

	const selectedTime: { hours: number; minutes: number; amOrPm: keyof typeof AmOrPm } = {
		hours: inputHours,
		minutes: inputMinutes,
		amOrPm: selectedTimeDayjs.hour() >= 12 ? 'PM' : 'AM'
	};

	$: {
		console.log('didi it');
		if (hourSchema.safeParse(inputHours)) selectedTime.hours = inputHours;
		else break $;

		if (minutesSchema.safeParse(inputMinutes)) selectedTime.minutes = inputMinutes;
		else break $;

		selectedTimeDayjs = dayjs(
			`${selectedTime.hours}:${selectedTime.minutes} ${selectedTime.amOrPm}`,
			'h:mm A'
		);
		selectedTimeString = selectedTimeDayjs.format(validTime);
	}
</script>

<div class="flex items-center">
	<Input bind:value={inputHours} placeholder="9" class="w-fit" />
	:
	<Input bind:value={inputMinutes} placeholder="5" class="w-fit" />

	<Select.Root
		selected={{ value: selectedTime.amOrPm, label: selectedTime.amOrPm }}
		onSelectedChange={(event) => {
			if (!event) return;
			selectedTime.amOrPm = event.value;
		}}
	>
		<Select.Trigger>
			<Select.Value placeholder="AM or PM" />
		</Select.Trigger>
		<Select.Content>
			{#each Object.values(AmOrPm) as value}
				<Select.Item {value}>{value}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
