<script lang="ts">
	export let count: number;
	export let average: number;
</script>

<div class="feedback-stats">
	<h4>Number of reviews: {count}</h4>
	<h4>Average rating: {average}</h4>
</div>

<style>
	.feedback-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
