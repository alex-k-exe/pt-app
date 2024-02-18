<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="container">
	<Navbar />
	<slot />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		padding: 10px;
		column-gap: 20px;
	}
</style>
