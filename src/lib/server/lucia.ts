import { dev } from '$app/environment';
import type { D1Database } from '@cloudflare/workers-types';
import { d1 } from '@lucia-auth/adapter-sqlite';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export function initLucia(db: D1Database) {
	return lucia({
		adapter: d1(db, { user: 'user', key: 'user_key', session: 'user_session' }),
		env: dev ? 'DEV' : 'PROD',
		middleware: sveltekit(),

		getUserAttributes: (data) => {
			return {
				username: data.username
			};
		}
	});
}

export type Auth = ReturnType<typeof initLucia>;
