import { dev } from '$app/environment';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { drizzle } from 'drizzle-orm/d1';
import { Miniflare } from 'miniflare';

const platformHandle: Handle = async ({ event, resolve }) => {
	if (event.platform) {
		event.locals.DRIZZLE_DB = drizzle(event.platform?.env.DB);
		return await resolve(event);
	}

	const mf = new Miniflare({
		script: '',
		d1Databases: ['DB']
	});

	event.locals.DRIZZLE_DB = drizzle(await mf.getD1Database('DB'));

	// event.platform = {
	// 	env: {
	// 		DB: db,
	// 		GOOGLE_ID: process.env.GOOGLE_ID!,
	// 		GOOGLE_SECRET: process.env.GOOGLE_SECRET!,
	// 		AUTHJS_SECRET: process.env.AUTHJS_SECRET!
	// 	},
	// 	context: {
	// 		waitUntil: function (): void {
	// 			throw new Error('Function not implemented.');
	// 		}
	// 	},
	// 	caches: await mf.getCaches()
	// };

	return await resolve(event);
};

const devAuthHandle = SvelteKitAuth(async () => {
	return {
		providers: [
			Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET })
		],
		secret: process.env.AUTHJS_SECRET,
		trustHost: true
	};
}) satisfies Handle;

const prodAuthHandle = SvelteKitAuth(async ({ platform }) => {
	return {
		providers: [
			Google({ clientId: platform?.env.GOOGLE_ID, clientSecret: platform?.env.GOOGLE_SECRET })
		],
		secret: platform?.env.AUTHJS_SECRET,
		trustHost: true
	};
}) satisfies Handle;

export const handle = sequence(platformHandle, dev ? devAuthHandle : prodAuthHandle);
