<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils/shadcn';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { CalendarDays } from 'lucide-svelte';

	export let selectedDate = dayjs().toDate();

	let value = new CalendarDate(
		selectedDate.getFullYear(),
		selectedDate.getMonth(),
		selectedDate.getDate()
	);
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	$: selectedDate = value.toDate(getLocalTimeZone());
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn('w-[240px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			<CalendarDays class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Select a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar bind:value weekStartsOn={1} />
	</Popover.Content>
</Popover.Root>
