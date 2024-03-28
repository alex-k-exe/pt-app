<script lang="ts">
	import DatePicker from '$lib/components/DatePicker.svelte';
	import type { Workout } from '$lib/server/drizzleTables';
	import type { DateValue } from '@internationalized/date';

    export let workout: Workout;

    function handleSelectDate(newDate: DateValue) {

    }
</script>

<DatePicker on:dateSelected=}/>
