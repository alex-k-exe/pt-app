<script lang="ts">
	import dayjs from 'dayjs';

	export let day: dayjs.Dayjs;
</script>

{day.format(day.date() === 1 ? 'MMM D' : 'D')}
