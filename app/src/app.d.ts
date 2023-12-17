import children from '$lib/server/db/schema.ts';

declare namespace App {
	interface Locals {}

	interface Platform {
		env: {
			COUNTER: DurableObjectNamespace;
			DB: D1Database;
		};
		context: {
			waitUntil(promise: Promise<unknown>): void;
		};
		caches: CacheStorage & { default: Cache };
	}

	interface Session {}

	interface Stuff {}

	type ChildSelectSchema = typeof children.$inferSelect;
	type ChildInsertSchema = typeof children.$inferInsert;
}
