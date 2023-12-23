<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
</script>

<form method="post" use:enhance>
	<Button>Sign out</Button>
</form>
