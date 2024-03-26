import { dev } from '$app/environment';
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';
import { Google } from 'arctic';
import { Lucia } from 'lucia';
import * as schema from './drizzleTables';

declare module 'lucia' {
	interface Register {
		Lucia: Lucia<Record<never, never>, schema.User>;
		DatabaseUserAttributes: schema.User;
	}
}

export const google = new Google(
	GOOGLE_ID,
	GOOGLE_SECRET,
	dev ? 'http://localhost:5173/login/callback' : 'https://pt-app.pages.dev/login/google/callback'
);
