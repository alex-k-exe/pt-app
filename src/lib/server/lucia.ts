import { dev } from '$app/environment';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import * as schema from '../drizzleTables';
import { Lucia } from 'lucia';
import type { Database } from 'better-sqlite3';

export function initLucia(db: Database) {
	const luciaAdapter = new BetterSqlite3Adapter(db, {
		user: 'users',
		session: 'sessions'
	});

	return new Lucia(luciaAdapter, {
		sessionCookie: {
			attributes: {
				// set to true when using HTTPS
				secure: !dev
			}
		},
		getUserAttributes: (attributes) => {
			return {
				id: attributes.id,
				email: attributes.email,
				name: attributes.name
			};
		}
	});
}

declare module 'lucia' {
	interface Register {
		Lucia: Lucia;
		DatabaseUserAttributes: schema.User;
	}
}
