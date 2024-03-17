import { dev } from '$app/environment';
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';
import type { User } from '$lib/server/drizzleTables';
import { Google } from 'arctic';
import { drizzle } from 'drizzle-orm/d1';
import { Lucia } from 'lucia';

declare global {
	namespace App {
		interface Locals {
			DRIZZLE_DB: ReturnType<typeof drizzle>;
		}
		interface Platform {
			env: {
				DB: D1Database;
				GOOGLE_ID: string;
				GOOGLE_SECRET: string;
				AUTHJS_SECRET: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}

	export const lucia = new Lucia(adapter, {
		sessionCookie: {
			attributes: {
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

	declare module 'lucia' {
		interface Register {
			Lucia: typeof lucia;
			DatabaseUserAttributes: User;
		}
	}

	export const google = new Google(
		GOOGLE_ID,
		GOOGLE_SECRET,
		'http://localhost:5173/login/callback'
	);
}

export {};
