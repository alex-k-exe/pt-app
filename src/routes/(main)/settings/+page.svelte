<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { setMode } from 'mode-watcher';

	// Define the theme options
	const themeOptions = {
		light: 'Light',
		dark: 'Dark',
		system: 'System'
	};
</script>

<Select.Root onSelectedChange={() => setMode}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Theme" />
	</Select.Trigger>
	<Select.Content>
		{#each Object.entries(themeOptions) as [value, label]}
			<Select.Item {value} {label}>{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
