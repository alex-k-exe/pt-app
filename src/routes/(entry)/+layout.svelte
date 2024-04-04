<script lang="ts">
	export let data;
</script>

<div class="flex justify-items-center gap-20">
	<h1>PT App</h1>
	<a href={`/signup?targetHref=${data.targetHref}`}><h2>Sign up</h2></a>
	<a href={`/login?targetHref=${data.targetHref}`}><h2>Log in</h2></a>
</div>

<slot />
