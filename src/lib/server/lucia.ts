import { dev } from '$app/environment';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import * as schema from '../drizzleTables';

export function initLucia(locals: App.Locals | undefined) {
	if (!locals?.db) throw new Error('Database is undefined');
	const luciaAdapter = new D1Adapter(locals.db, {
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
