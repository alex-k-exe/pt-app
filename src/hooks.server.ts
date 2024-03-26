import { dev } from '$app/environment';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import type { Handle } from '@sveltejs/kit';
import { Lucia } from 'lucia';

export const handle: Handle = async ({ event, resolve }) => {
	const luciaAdapter = new D1Adapter(event.platform?.env.DB, {
		user: 'users',
		session: 'sessions'
	});

	const lucia = new Lucia(luciaAdapter, {
		sessionCookie: {
			attributes: {
				// set to true when using HTTPS
				secure: !dev
			}
		}
	});
	event.locals.lucia = lucia;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
