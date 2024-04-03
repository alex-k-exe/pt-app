<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';

	export let signupTokenId: string;
</script>

<form method="POST" action="?/delete">
	<input type="hidden" name="signupTokenId" value={signupTokenId} />
	<Button variant="outline" size="icon">
		<X />
	</Button>
</form>
