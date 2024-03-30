<script lang="ts">
	import dayjs from 'dayjs';

	export let day: dayjs.Dayjs;
</script>

<a href={'/workouts/day-view?date=' + day.format('DD-MM-YYYY')}>
	{day.format(day.date() === 1 ? 'MMM D' : 'D')}
</a>
