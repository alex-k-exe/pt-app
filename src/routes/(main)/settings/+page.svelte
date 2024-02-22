<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { setMode } from 'mode-watcher';

	let;
</script>

<Select.Root onSelectedChange={() => setMode()}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="App theme" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Theme options</Select.Label>
			{#each themeOptions as option}
				<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="chosenTheme" />
</Select.Root>
