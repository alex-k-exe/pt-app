import { google } from '$lib/server/lucia';
import { setCookie } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export async function GET({ cookies }): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	setCookie(cookies, 'google_oauth_state', state);
	setCookie(cookies, 'code_verifier', codeVerifier);

	const url = await google.createAuthorizationURL(state, codeVerifier);
	redirect(302, url.toString());
}
