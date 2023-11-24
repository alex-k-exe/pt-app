<script lang="ts">
	import type { TReview } from '../../routes/+page.svelte';
	import Review from './Review.svelte';
	export let feedback: TReview[] = [];

	console.log(feedback);
</script>

{#each feedback as fb (fb.id)}
	<Review item={fb} on:delete-feedback />
{/each}
