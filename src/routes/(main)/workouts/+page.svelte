<script>
	import MonthGrid from '$lib/components/calendar/MonthGrid.svelte';
	import { getDaysOfMonth } from '$lib/utils/dates';
</script>

<h1 class="header">Workouts</h1>

<MonthGrid month={getDaysOfMonth(5)} />

<style>
	.header {
		justify-self: end;
		justify-content: end;
	}
</style>
