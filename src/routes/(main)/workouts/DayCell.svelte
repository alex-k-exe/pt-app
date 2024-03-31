<script lang="ts">
	import { dayOnlyFormat } from '$lib/utils/types/other';
	import dayjs from 'dayjs';

	export let day: dayjs.Dayjs;
</script>

<a href={'/workouts/day-view?date=' + day.format(dayOnlyFormat)}>
	{day.format(day.date() === 1 ? 'MMM D' : 'D')}
</a>
