import { google } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export async function GET({ cookies }): Promise<Response> {
	const state = generateState();

	cookies.set('google_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10
	});

	const url = await google.createAuthorizationURL(state, generateCodeVerifier());
	redirect(302, url.toString());
}
