import { initializeLucia } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = initializeLucia(event.platform).handleRequest(event);
	return await resolve(event);
};
