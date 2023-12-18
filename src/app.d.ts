import { initLucia } from '$lib/server/lucia';

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

/// <reference types="lucia-types" />
declare global {
	namespace LuciaTypes {
		type Auth = ReturnType<typeof initLucia>;
		type DatabaseUserAttributes = {
			username: string;
		};
		type DatabaseSessionAttributes = object;
	}
}

export {};
