<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import { Button } from './button';
	import * as Form from './form';
	import { Input } from './input';

	let passwordInputType: 'password' | '' = 'password';
</script>

<Form.Control let:attrs>
	<Form.Label>Password</Form.Label>
	<div class="flex">
		<Input {...attrs} type={passwordInputType} />
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
