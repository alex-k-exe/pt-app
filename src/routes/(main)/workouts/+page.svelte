<script>
	import MonthGrid from '$lib/components/calendar/MonthGrid.svelte';
	import { getDaysForCalendar } from '$lib/utils/dates';
	import dayjs from 'dayjs';
</script>

<h1 class="header">Workouts</h1>

<MonthGrid month={getDaysForCalendar(dayjs().month())} />
