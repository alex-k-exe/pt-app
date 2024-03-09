<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { setMode } from 'mode-watcher';

	// Define the theme options
	const themeOptions = {
		light: 'Light',
		dark: 'Dark',
		system: 'System'
	} as const;

	function handleSelectTheme(selected: unknown) {
		const validModes = ['light', 'dark', 'system'] as const;
		if (validModes.includes(selected as keyof typeof themeOptions)) {
			setMode(selected as keyof typeof themeOptions);
		}
	}
</script>

<Select.Root onSelectedChange={(selected) => handleSelectTheme(selected)}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Theme" />
	</Select.Trigger>
	<Select.Content>
		{#each Object.entries(themeOptions) as [value, label]}
			<Select.Item {value} {label}>{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
