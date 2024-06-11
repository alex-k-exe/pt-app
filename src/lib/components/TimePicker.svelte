<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { dayjs } from '$lib/utils/dates';
	import z from 'zod';
	import Input from './ui/input/input.svelte';

	export let selectedDate = new Date();

	const AmOrPm = {
		AM: 'AM',
		PM: 'PM'
	} as const;

	let inputHours = selectedDate.getHours() % 12;
	let inputMinutes = Number(dayjs(selectedDate).format('mm'));

	const selectedTime: { hours: number; minutes: number; amOrPm: keyof typeof AmOrPm } = {
		hours: inputHours,
		minutes: inputMinutes,
		amOrPm: selectedDate.getHours() >= 12 ? 'PM' : 'AM'
	};

	const hourSchema = z.number().min(0).max(12);
	const minutesSchema = z.number().min(0).max(59);

	$: {
		if (hourSchema.safeParse(inputHours)) selectedTime.hours = inputHours;
		else break $;

		if (minutesSchema.safeParse(inputMinutes)) selectedTime.minutes = inputMinutes;
		else break $;

		selectedDate = dayjs(
			`${selectedTime.hours}:${selectedTime.minutes} ${selectedTime.amOrPm}`,
			'h:mm A'
		).toDate();
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
