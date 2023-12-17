import type { Handle } from '@sveltejs/kit';
import Auth from 'lucia';

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = Auth.handleRequest(event);
	return await resolve(event);
};
