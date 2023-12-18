import { dev } from '$app/environment';
import type { D1Database } from '@cloudflare/workers-types';
import { d1 } from '@lucia-auth/adapter-sqlite';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export function initializeLucia(db: D1Database) {
	const auth = lucia({
		adapter: d1(db, {
			user: 'user',
			key: 'user_key',
			session: 'user_session'
		}),
		middleware: sveltekit(),
		env: dev ? 'DEV' : 'PROD',
		getUserAttributes: (data) => {
			return {
				username: data.username
			};
		}
	});
	return auth;
}

export type Auth = ReturnType<typeof initializeLucia>;
