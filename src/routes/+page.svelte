<script context="module" lang="ts">
	export type TReview = {
		id: number;
		rating: number;
		text: string;
	};
</script>

<script lang="ts">
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';

	import FeedbackList from '$lib/components/FeedbackList.svelte';
	import FeedbackStats from '$lib/components/FeedbackStats.svelte';
	import '$lib/global.css';

	$: count = feedback.length;
	$: average = feedback.reduce((sum, { rating }) => sum + rating, 0) / count;

	const addFeedback = (event: CustomEvent<TReview>) => {
		let { rating, text } = event.detail;
		feedback = [{ id: feedback.length, rating, text }, ...feedback];
	};

	const deleteFeedback = (event: CustomEvent<number>) => {
		feedback = feedback.filter((item) => item.id !== event.detail);
	};

	let feedback: TReview[] = [
		{
			id: 1,
			rating: 10,
			text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. consequuntur vel vitae commodi alias voluptatem est voluptatum ipsa quae.'
		},
		{
			id: 2,
			rating: 9,
			text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. consequuntur vel vitae commodi alias voluptatem est voluptatum ipsa quae.'
		},
		{
			id: 3,
			rating: 8,
			text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. consequuntur vel vitae commodi alias voluptatem est voluptatum ipsa quae.'
		}
	];
</script>

<main class="container">
	<FeedbackForm on:add-feedback={addFeedback} />
	<FeedbackStats {count} {average} />
	<FeedbackList {feedback} on:delete-feedback={deleteFeedback} />
</main>
