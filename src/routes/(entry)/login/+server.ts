import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = await google.createAuthorizationURL(state, generateCodeVerifier());

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
