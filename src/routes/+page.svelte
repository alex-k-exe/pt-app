<script lang="ts">
	import { compile } from 'svelte/compiler';

	interface Task {
		description: String;
		completed: boolean;
	}
	let tasks: Task[] = [
		{ description: 'Feed dog', completed: false },
		{ description: 'Do homework', completed: true }
	];
</script>

<h1>Welcome to MyTodoApp</h1>

{#each tasks as task}
	<div style="display:inline-flex; gap:10px">
		<button on:click={() => (task.completed = !task.completed)}>
			{task.completed ? 'Restart' : 'Complete'}</button
		>
		{task.completed ? }
	</div>
	<p />
{/each}
