<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';

	export let signupTokenId: string;
</script>

<form method="POST" action="?/deleteToken">
	<input type="hidden" name="signupTokenId" value={signupTokenId} />
	<Button variant="outline" size="icon" type="submit">
		<X />
	</Button>
</form>
