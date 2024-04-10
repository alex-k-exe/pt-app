<script lang="ts">
	export let data;
</script>

<div class="flex justify-items-center gap-20">
	<h1>PT App</h1>
	<a href={`/signup?targetPath=${data.targetPath}`}><h2>Sign up</h2></a>
	<a href={`/login?targetPath=${data.targetPath}`}><h2>Log in</h2></a>
</div>

<slot />
