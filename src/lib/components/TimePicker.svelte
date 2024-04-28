<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { dayjs } from '$lib/utils/dates';
	import z from 'zod';

	export let selectedDate = new Date();

	const AmOrPm = {
		AM: 'AM',
		PM: 'PM'
	} as const;

	const selectedTime: { hours: string; minutes: string; amOrPm: keyof typeof AmOrPm } = {
		hours: (selectedDate.getHours() % 12).toString(),
		minutes: dayjs(selectedDate).format('mm'),
		amOrPm: selectedDate.getHours() >= 12 ? 'PM' : 'AM'
	};
	$: selectedDate = dayjs(
		`${selectedTime.hours}:${selectedTime.minutes} ${selectedTime.amOrPm}`,
		'h:mm A'
	).toDate();

	const hourSchema = z.string().min(1).max(2).regex(/\d+$/);
	const minutesSchema = z
		.string()
		.length(2)
		.regex(/\d{2}$/);

	function handleHoursChange(value: unknown, changingHours: boolean) {
		const validatedValue = (changingHours ? hourSchema : minutesSchema).safeParse(value);
		if (!validatedValue.success) console.log(validatedValue.error);
		else console.log(validatedValue.data);
		if (changingHours) {
			selectedTime.hours = validatedValue.success ? validatedValue.data : selectedTime.hours;
		} else {
			selectedTime.minutes = validatedValue.success ? validatedValue.data : selectedTime.minutes;
		}
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
