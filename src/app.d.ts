import { drizzle } from 'drizzle-orm/d1';

declare global {
	namespace App {
		interface Locals {
			DRIZZLE_DB: ReturnType<typeof drizzle>;
		}
		interface Platform {
			env: {
				DB: D1Database;
				GOOGLE_ID: string;
        // hello!
				GOOGLE_SECRET: string;
				AUTHJS_SECRET: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
