<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	export let data;
	export let signupTokenId: string;
</script>

<h2>Sign up</h2>

<form method="POST" use:enhance>
	<Input name="signupToken" bind:value={signupTokenId} />
	<p class="text-sm text-muted-foreground">A 6 digit code that your trainer should give you</p>
	<Form.Button>Submit</Form.Button>
</form>

{data.error ?? ''}
