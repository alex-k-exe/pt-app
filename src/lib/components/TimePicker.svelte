<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { timeOnlyFormat } from '$lib/utils/types/other';
	import dayjs from 'dayjs';
	import z from 'zod';

	export let selectedDate = dayjs().toDate();

	const AmOrPm = {
		AM: 'am',
		PM: 'pm'
	} as const;

	const selectedTime: { hours: number; minutes: number; amOrPm: keyof typeof AmOrPm } = {
		hours: 0,
		minutes: 0,
		amOrPm: 'AM'
	};
	$: selectedDate = dayjs(
		`${selectedTime.hours}:${selectedTime.minutes}-${selectedTime.amOrPm}`,
		timeOnlyFormat
	).toDate();

	const hourSchema = z.number().int().gte(0).lte(12);
	const minutesSchema = z.number().int().gte(0).lt(60);

	function handleHoursChange(value: unknown, changingHours: boolean) {
		const validatedValue = (changingHours ? hourSchema : minutesSchema).safeParse(value);
		if (!validatedValue.success) return;
		if (changingHours) selectedTime.hours = validatedValue.data;
		else selectedTime.minutes = validatedValue.data;
	}
</script>

<div class="flex items-center">
	<Input
		value={selectedTime.hours}
		on:change={(value) => handleHoursChange(value, true)}
		placeholder="00"
	/>
	:
	<Input
		value={selectedTime.minutes}
		on:change={(value) => handleHoursChange(value, false)}
		placeholder="00"
	/>

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
