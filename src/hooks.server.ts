import { dev } from '$app/environment';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { Miniflare } from 'miniflare';

const platformHandle: Handle = async ({ event, resolve }) => {
	if (dev) {
		event.locals.platform = event.platform!;
		return await resolve(event);
	}
	const mf = new Miniflare({
		script: '',
		d1Databases: ['DB']
	});
	// const platform: App.Platform = {};
	// platform.env.DB = mf.getD1Database('DB');

	return await resolve(event);
};

const defaultHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	return response;
};

const authHandle = dev
	? defaultHandle
	: (SvelteKitAuth(async ({ platform }) => {
			return {
				providers: [
					Google({ clientId: platform?.env.GOOGLE_ID, clientSecret: platform?.env.GOOGLE_SECRET })
				],
				secret: platform?.env.AUTHJS_SECRET,
				trustHost: true
			};
		}) satisfies Handle);

export const handle = sequence(platformHandle, authHandle);
