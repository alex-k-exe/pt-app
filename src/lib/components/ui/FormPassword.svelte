<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import { Button } from './button';
	import * as Form from './form';
	import { Input } from './input';

	export let value: string | undefined;
	export let showPassword = false;
	export let label = 'Password';
</script>

<Form.Control let:attrs>
	<Form.Label>{label}</Form.Label>
	<div class="flex">
		<Input {...attrs} class="w-fit" type={showPassword ? '' : 'password'} bind:value />
		<Button on:click={() => (showPassword = !showPassword)}>
			{#if showPassword}
				<Eye />
			{:else}
				<EyeOff />
			{/if}
		</Button>
	</div>
</Form.Control>
