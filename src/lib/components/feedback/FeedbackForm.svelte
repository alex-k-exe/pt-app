<script lang="ts">
	import { Button, TextInput } from '@svelteuidev/core';
	import { createEventDispatcher } from 'svelte';
	import Card from '../Card.svelte';

	let dispatch = createEventDispatcher();

	let rating: number = 5;
	let text: string = '';
</script>

<form>
	<!-- Select rating -->
	<Card>
		<p>Rating:</p>
		<div class="rating-buttons">
			{#each { length: 5 } as _, i}
				<Button compact on:click={() => (rating = i)} variant={rating === i ? 'filled' : 'outline'}
					>{i + 1}</Button
				>
			{/each}
		</div>
		<div class="text-and-submit">
			<TextInput bind:value={text} label="Reason for your rating:" placeholder="Tell us why" />
			<Button on:click={() => dispatch('add-feedback', { rating, text })}>Submit</Button>
		</div>
	</Card>
</form>

<style lang="scss">
	// button.active {
	// 	background-color: orange;
	// }

	// button {
	// 	padding: 5px 10px;
	// }

	.rating-buttons {
		display: flex;
		justify-content: space-evenly;
	}
	.text-and-submit {
		display: flex;
		justify-content: space-between;
	}
</style>
