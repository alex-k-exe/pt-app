<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from './Card.svelte';

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
				<button class:active={rating === i} on:click={() => (rating = i)}>{i}</button>
			{/each}
		</div>
		<div class="text-and-submit">
			<input type="text" bind:value={text} placeholder="Tell us why" />
			<button on:click={() => dispatch('add-feedback', { rating, text })}>Submit</button>
		</div>
	</Card>
</form>

<style lang="scss">
	button.active {
		background-color: orange;
	}

	button {
		padding: 5px 10px;
	}

	.rating-buttons {
		display: flex;
		justify-content: space-evenly;
	}
	.text-and-submit {
		display: flex;
		justify-content: space-between;
	}
</style>
