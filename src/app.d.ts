declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface Platform {
			env: {
				DB: D1Database;
			};
			// TODO remove context and caches if not needed
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
