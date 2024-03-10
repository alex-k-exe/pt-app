<script>
	import { Button } from '$lib/components/ui/button';
</script>

<div class="container">
	<h1>Log in</h1>
	<a href="/">Sign in with google</a>
	<Button>Hello</Button>
	<div
		id="g_id_onload"
		data-client_id="YOUR_GOOGLE_CLIENT_ID"
		data-login_uri="https://your.domain/your_login_endpoint"
		data-your_own_param_1_to_login="any_value"
		data-your_own_param_2_to_login="any_value"
	></div>
</div>
