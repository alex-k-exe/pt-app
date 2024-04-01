<script lang="ts">
	import { type SeriesWithSets } from '$lib/utils/types/other.js';
	import { type DndEvent } from 'svelte-dnd-action';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<FormSchema>>;

	type FormSchema = typeof formSchema;

	const flipDurationMs = 300;
	function handleDndChange(e: CustomEvent<DndEvent>) {
		workout.series = e.detail.items as SeriesWithSets[];
	}
</script>

<style>
	.dateTimePicker {
		width: fit-content;
		display: inline-flex;
		column-gap: 5px;
		align-items: center;
	}

	.workoutEditor {
		margin-top: 20px;
	}

	.createdWorkout {
		display: flex;
		flex-wrap: wrap;
		row-gap: 20px;
		column-gap: 20px;
	}
</style>
