import { initLucia } from '$lib/server/lucia';
import { userTypes } from '$lib/utils/types';
import { drizzle } from 'drizzle-orm/d1';
import sqlite from 'better-sqlite3';

export async function handle({ event, resolve }) {
	const lucia = initLucia(event.platform);
	event.locals.lucia = lucia;
	event.locals.db = drizzle(event.platform.env.DB);

	if (routeIsPublic(event.url.pathname)) return resolve(event);
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	const userType = event.cookies.get('userType');

	const targetPath = event.url.pathname;
	if (!sessionId || !userType || (userType !== 'Client' && userType !== 'Trainer')) {
		event.locals.user = null;
		event.locals.session = null;
		return new Response(null, {
			status: 302,
			headers: { location: `/login?targetPath=${targetPath}` }
		});
	}

	const { session, user } = await lucia.validateSession(sessionId);
	const sessionCookie = session
		? lucia.createSessionCookie(session.id)
		: lucia.createBlankSessionCookie();

	if (!session || !session.fresh) {
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	event.locals.userType = userType;

	const clientCantVisitPage = targetPath.startsWith('/clients');
	if (event.locals.userType === userTypes.CLIENT && clientCantVisitPage) {
		return new Response(null, {
			status: 404,
			headers: { location: `/workouts` }
		});
	}
	return resolve(event);
}

export function routeIsPublic(route: string) {
	route = route.charAt(0) === '/' ? route.substring(1) : route;
	const publicRoutes = ['admin', 'login', 'signup'];
	return publicRoutes.some((publicRoute) => route.startsWith(publicRoute));
}
