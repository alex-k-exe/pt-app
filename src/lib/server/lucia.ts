import type { D1Database } from '@cloudflare/workers-types';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Lucia, TimeSpan } from 'lucia';

function createAdapter(d1: D1Database) {
	const db = drizzle(d1);

	const userTable = sqliteTable('user', {
		id: text('id').primaryKey()
	});

	const sessionTable = sqliteTable('user_session', {
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id),
		expiresAt: integer('expires_at').notNull()
	});

	return new DrizzleSQLiteAdapter(db, sessionTable, userTable);
}

export function initLucia(db: D1Database) {
	return new Lucia(createAdapter(db), {
		// getSessionAttributes: (attributes) => {
		// 	return {
		// 		ipCountry: attributes.country
		// 	};
		// },
		getUserAttributes: (attributes) => {
			return {
				username: attributes.username
			};
		},
		sessionExpiresIn: new TimeSpan(30, 'd'), // expires in 30 days
		sessionCookie: {
			name: 'session',
			expires: false, // session cookies have very long lifespan (2 years)
			attributes: {
				secure: true,
				sameSite: 'strict'
				// TODO configure domain for secure cookies
				// domain: 'pt-app.pages.dev'
			}
		}
	});
}

declare module 'lucia' {
	interface Register {
		Lucia: ReturnType<typeof initLucia>;
	}
	interface DatabaseSessionAttributes {
		// country: string;
	}
	interface DatabaseUserAttributes {
		username: string;
	}
}
