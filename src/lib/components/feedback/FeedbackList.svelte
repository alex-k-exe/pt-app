<script lang="ts">
	import type { FeedbackItem } from '$routes/+page.svelte';
	import { Button } from '@svelteuidev/core';
	import Card from '../Card.svelte';

	import { createEventDispatcher } from 'svelte';
	export let feedback: FeedbackItem[] = [];

	const dispatch = createEventDispatcher();

	const handleDelete = (itemId: number) => {
		dispatch('delete-feedback', itemId);
	};
</script>

{#each feedback as fb (fb.id)}
	<Card>
		<div class="num-display">
			{fb.rating}
		</div>
		<Button style="float:right" compact class="close" on:click={() => handleDelete(fb.id)}>X</Button
		>
		<p class="text-display">
			{fb.text}
		</p>
	</Card>
{/each}

<style lang="scss">
	.num-display {
		position: absolute;
		top: -10px;
		left: -10px;
		width: 50px;
		height: 50px;
		background: #ff6a95;
		color: #fff;
		border: 1px #eee solid;
		border-radius: 50%;
		padding: 10px;
		text-align: center;
		font-size: 19px;
	}

	.close {
		position: absolute;
		top: 10px;
		right: 20px;
		cursor: pointer;
		background: none;
		border: none;
	}
</style>
