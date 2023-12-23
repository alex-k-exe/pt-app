import { initLucia } from '$lib/server/lucia';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = initLucia(event.platform!.env.DB).handleRequest(event);
	return await resolve(event);
};
