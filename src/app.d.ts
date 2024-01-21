declare global {
	namespace App {
		interface Locals {
			/* see https://github.com/sveltejs/kit/issues/4292
			platform.env is undefined in local development with sveltekit
			in hooks.server.ts, real or simulated platform is assigned to locals.platform*/
			platform: Platform;
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
}

export {};
