import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),

	// I use plural names for tables instead of singular.
	adapter: d1(dbConnection, {
		user: 'users',

		// I changed the name from 'user_key' to 'user_providers'
		// as I find more meaningfull.
		key: 'user_providers',
		session: 'user_sessions'
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

export const githubAuth = github(auth, {
	clientId: env.GITHUB_OAUTH_CLIENT_ID!,
	clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET!,
	scope: ['read:user', 'user:email']
});

export const googleAuth = google(auth, {
	clientId: env.GOOGLE_OAUTH_CLIENT_ID!,
	clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET!,
	redirectUri: env.GOOGLE_OAUTH_REDIRECT_URI!,
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
});

export type Auth = typeof auth;
