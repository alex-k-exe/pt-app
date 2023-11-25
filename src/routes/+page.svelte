<script context="module" lang="ts">
	export type FeedbackItem = {
		id: number;
		rating: number;
		text: string;
	};
</script>

<script lang="ts">
	import FeedbackForm from '$lib/components/feedback/FeedbackForm.svelte';

	import FeedbackList from '$lib/components/feedback/FeedbackList.svelte';
	import FeedbackStats from '$lib/components/feedback/FeedbackStats.svelte';
	import '$lib/global.css';

	$: count = feedback.length;
	$: average = feedback.reduce((sum, { rating }) => sum + rating, 0) / count;

	const addFeedback = (event: CustomEvent<FeedbackItem>) => {
		let { rating, text } = event.detail;

		if (!text || !rating) {
			return;
		}

		feedback = [{ id: feedback.length, rating: rating, text: text }, ...feedback];
	};

	const deleteFeedback = (event: CustomEvent<number>) => {
		feedback = feedback.filter((item) => item.id !== event.detail);
	};

	let feedback: FeedbackItem[] = [
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
