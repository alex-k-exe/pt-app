import { initLucia } from '$lib/server/lucia';
import { UserType } from '$lib/utils/types/other';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const lucia = initLucia(event.platform);
	event.locals.lucia = lucia;

	if (event.url.href.startsWith('/admin') || event.url.href.startsWith('/login'))
		return resolve(event);
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		return new Response(null, {
			status: 302,
			headers: { location: `/login?targetHref=${event.url.href}` }
		});
	}

	const { session, user } = await lucia.validateSession(sessionId);
	const sessionCookie = session
		? lucia.createSessionCookie(session.id)
		: lucia.createBlankSessionCookie();

	if (!session || !session.fresh) {
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	const clientCantVisitPage = event.url.href.startsWith('/clients');
	if (event.locals.userType === UserType.CLIENT && clientCantVisitPage) {
		return new Response(null, {
			status: 403,
			headers: { location: `/workouts` }
		});
	}
	return resolve(event);
};
