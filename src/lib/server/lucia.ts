import { dev } from '$app/environment';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import { Lucia } from 'lucia';
import * as schema from '../drizzleTables';

export function initLucia(platform: App.Platform | undefined) {
	if (!platform?.env.DB) throw new Error('Database is undefined');
	const luciaAdapter = new D1Adapter(platform.env.DB, {
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
				email: attributes.email,
				name: attributes.name
			};
		}
	});
}

declare module 'lucia' {
	interface Register {
		Lucia: Lucia<Record<never, never>, schema.User>;
		DatabaseUserAttributes: schema.User;
	}
}
