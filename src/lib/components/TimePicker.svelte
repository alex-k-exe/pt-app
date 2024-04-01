<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import dayjs from 'dayjs';
	import z from 'zod';

	export let selectedTimeString = dayjs().toString();

	const AmOrPm = {
		AM: 'am',
		PM: 'pm'
	} as const;

	const selectedTime: { hours: number; minutes: number; amOrPm: keyof typeof AmOrPm } = {
		hours: 0,
		minutes: 0,
		amOrPm: 'AM'
	};
	$: selectedTimeString = dayjs(
		`${selectedTime.hours}-${selectedTime.minutes}-${selectedTime.amOrPm}`,
		'h-m-A'
	).toString();

	const hourSchema = z.number().int().gte(0).lte(12);
	const minutesSchema = z.number().int().gte(0).lt(60);

	function handleHoursChange(value: unknown, changingHours: boolean) {
		if (!(changingHours ? hourSchema : minutesSchema).safeParse(value).success) return;
		if (changingHours) selectedTime.hours = value as number;
		else selectedTime.minutes = value as number;
	}
</script>

<div class="inline-block">
	<Input
		bind:value={selectedTime.hours}
		on:input={(value) => handleHoursChange(value, true)}
		placeholder="00"
	/>
	:
	<Input
		bind:value={selectedTime.minutes}
		on:input={(value) => handleHoursChange(value, false)}
		placeholder="00"
	/>

	<Select.Root>
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
