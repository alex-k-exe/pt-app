<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import dayjs from 'dayjs';
	import z from 'zod';

	export let selectedDate = dayjs().toDate();

	const AmOrPm = {
		AM: 'am',
		PM: 'pm'
	} as const;

	const selectedTime: { hours: string; minutes: string; amOrPm: keyof typeof AmOrPm } = {
		hours: '9',
		minutes: '05',
		amOrPm: 'AM'
	};
	$: selectedDate = new Date(selectedTime.minutes);

	const hourSchema = z.string().min(1).max(2).regex(/\d+$/);
	const minutesSchema = z.string().length(2).regex(/\d+$/);

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
		placeholder="9"
	/>
	:
	<Input
		value={selectedTime.minutes}
		on:change={(value) => handleHoursChange(value, false)}
		placeholder="05"
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
