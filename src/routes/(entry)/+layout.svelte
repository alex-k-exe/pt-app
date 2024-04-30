<script lang="ts">
	export let data;

	const pathURIComponent = data.targetPath ? `?targetPath=${data.targetPath}` : '';
</script>

<div class="flex justify-items-center gap-20">
	<h1>PT App</h1>
	<a href={'/signup' + pathURIComponent}><h2>Sign up</h2></a>
	<a href={'/login' + pathURIComponent}><h2>Log in</h2></a>
</div>

<slot />

<p class="text-red-500">{data.error ?? ''}</p>
