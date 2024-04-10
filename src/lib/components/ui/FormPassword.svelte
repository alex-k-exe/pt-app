<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import { Button } from './button';
	import * as Form from './form';
	import { Input } from './input';

	export let passwordInputType: 'password' | '' = 'password';
	export let value: string;
	export let label: string = 'Password';
</script>

<Form.Control let:attrs>
	<Form.Label>{label}</Form.Label>
	<div class="flex">
		<Input {...attrs} type={passwordInputType} bind:value />
		<Button
			on:click={() => (passwordInputType = passwordInputType === 'password' ? '' : 'password')}
		>
			{#if passwordInputType === 'password'}
				<Eye />
			{:else}
				<EyeOff />
			{/if}
		</Button>
	</div>
</Form.Control>
