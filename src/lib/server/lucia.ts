import { dev } from '$app/environment';
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import { Google } from 'arctic';
import { Lucia } from 'lucia';
import * as schema from '../drizzleTables';

export function initLucia(DB: D1Database) {
	const luciaAdapter = new D1Adapter(DB, {
		user: 'users',
		session: 'sessions'
	});

	return new Lucia(luciaAdapter, {
		sessionCookie: {
			attributes: {
				// set to true when using HTTPS
				secure: !dev
			}
		}
	});
}

export const google = new Google(
	GOOGLE_ID,
	GOOGLE_SECRET,
	dev
		? 'http://localhost:5173/login/google/callback'
		: 'https://pt-app.pages.dev/login/google/callback'
);

declare module 'lucia' {
	interface Register {
		Lucia: Lucia<Record<never, never>, schema.User>;
		DatabaseUserAttributes: schema.User;
	}
}
