<script>
	import { SignIn } from '@auth/sveltekit/components';
</script>

<span class="notSignedInText">You are not signed in</span>
<SignIn>
	<div slot="submitButton" class="buttonPrimary">Sign in</div>
</SignIn>
<SignIn provider="facebook" />
