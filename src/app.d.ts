import { UserType } from '$lib/utils/types/other';
import { Lucia, Session, User } from 'lucia';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			userType: keyof typeof UserType;
			session: Session | null;
			lucia: Lucia;
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
