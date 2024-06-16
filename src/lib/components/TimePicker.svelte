<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { dayjs } from '$lib/utils/dates';
	import { validTime } from '$lib/utils/types';
	import z from 'zod';
	import { Input, type FormInputEvent } from './ui/input';

	// TODO: name these variables better
	export let selectedTimeString = dayjs().format(validTime);
	let selectedTimeDayjs = dayjs(selectedTimeString, validTime);

	const hourSchema = z
		.string()
		.min(1)
		.max(2)
		.refine(
			(data) => Number(data) > 0 && Number(data) <= 12 && Math.floor(Number(data)) === Number(data)
		);
	const minutesSchema = z
		.string()
		.length(2)
		.refine(
			(data) => Number(data) >= 0 && Number(data) < 60 && Math.floor(Number(data)) === Number(data)
		);

	const selectedTime: { hours: string; minutes: string; amOrPm: string } = {
		hours: selectedTimeDayjs.format('h'),
		minutes: selectedTimeDayjs.format('mm'),
		amOrPm: selectedTimeDayjs.format('A')
	};

	function updateSelectedTime(event: FormInputEvent<InputEvent>, changingHours: boolean) {
		console.log('here');
		selectedTimeDayjs = selectedTimeDayjs;
		if (!event.target) return;
		const { value } = event.target as HTMLInputElement;

		if (changingHours) {
			if (hourSchema.safeParse(value).success) selectedTime.hours = value;
			else return;
		} else {
			if (minutesSchema.safeParse(value).success) selectedTime.minutes = value;
			else return;
		}

		selectedTimeString = `${selectedTime.hours}:${selectedTime.minutes} ${selectedTime.amOrPm}`;
		selectedTimeDayjs = dayjs(selectedTimeString, 'h:mm A');
	}
</script>

<div class="flex items-center">
	<Input
		value={selectedTime.hours}
		placeholder="9"
		class="w-fit"
		on:input={(event) => updateSelectedTime(event, true)}
	/>
	:
	<Input
		value={selectedTime.minutes}
		placeholder="05"
		class="w-fit"
		on:input={(event) => updateSelectedTime(event, false)}
	/>

	<Select.Root
		selected={{ value: selectedTime.amOrPm, label: selectedTime.amOrPm }}
		onSelectedChange={(event) => {
			if (!event) return;
			selectedTime.amOrPm = event.value;
			selectedTimeString = `${selectedTime.hours}:${selectedTime.minutes} ${selectedTime.amOrPm}`;
			selectedTimeDayjs = dayjs(selectedTimeString, 'h:mm A');
		}}
	>
		<Select.Trigger>
			<Select.Value placeholder="AM or PM" />
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="AM">AM</Select.Item>
			<Select.Item value="PM">PM</Select.Item>
		</Select.Content>
	</Select.Root>
</div>
