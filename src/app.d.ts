declare global {
	namespace App {
		interface Locals {
			/* see https://github.com/sveltejs/kit/issues/4292
			platform.env is undefined in local development with sveltekit
			in hooks.server.ts:
			in prod is assigned env.DB, in dev is assigned new DB with wrangler-proxy */
			DB: D1Database;
		}
		interface Platform {
			env: {
				// locals.DB should be used instead
				DB: D1Database;
			};
		}
	}
}

export {};
