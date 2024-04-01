import { initLucia } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// setup Lucia client with D1 database
	const lucia = initLucia(event.platform);
	event.locals.lucia = lucia;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	// TODO: add URL parameter to /login for the page they were trying to visit
	if (!sessionId) throw redirect(302, '/login');

	const { session, user } = await lucia.validateSession(sessionId);
	const sessionCookie = session
		? lucia.createSessionCookie(session.id)
		: lucia.createBlankSessionCookie();

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
