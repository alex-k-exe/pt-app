import { type Handle } from '@sveltejs/kit';
import { connectD1 } from 'wrangler-proxy';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.DB = event.platform?.env?.DB ?? connectD1('DB');
	return await resolve(event);
};
