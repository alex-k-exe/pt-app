import { initLucia } from '$lib/server/lucia';
import { type ObjectValues, type userTypes } from '$lib/utils/types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Session, User } from 'lucia';

declare global {
	namespace App {
		interface Locals {
			db: DrizzleD1Database<Record<string, never>>;
			user: User | null;
			userType: ObjectValues<typeof userTypes> | null;
			session: Session | null;
			lucia: ReturnType<typeof initLucia>;
		}
		interface Platform {
			env: {
				adminPassword: string;
				DB: D1Database;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
