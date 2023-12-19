<script lang="ts">
	import type { PageData } from './$types';
	import SignupForm from './signup-form.svelte';
	export let data: Awaited<PageData>;
</script>

<SignupForm form={data.form} />
