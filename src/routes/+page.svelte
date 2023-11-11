<script lang="ts">
	type Task = {
		description: String;
		completed?: boolean;
	};
	let tasks: Task[] = [
		{ description: 'Feed dog' },
		{ description: 'Do homework', completed: true }
	];

	let newTaskDesc: string;

	const createTask = () => {
		if (!newTaskDesc) return;
		tasks = [...tasks, { description: newTaskDesc }];
		newTaskDesc = '';
	};
</script>

<h1>Welcome to MyTodoApp</h1>

{#each tasks as task}
	<div class="task">
		<button class="btn" on:click={() => (task.completed = !task.completed)}>
			{task.completed ? 'Restart' : 'Complete'}</button
		>
		<p>
			{#if task.completed}
				<s>{task.description}</s>
			{:else}
				{task.description}
			{/if}
		</p>
	</div>
	<p />
{/each}

<div class="task">
	<button class="btn" on:click={() => createTask()}>Create task</button>
	<input bind:value={newTaskDesc} />
</div>

<style lang="scss">
	.btn {
		height: fit-content;
		min-height: 10px;
		min-width: 50px;
		padding: 5px;
	}
	.task {
		display: inline-flex;
		gap: 10px;
		align-items: center;
	}
</style>
