import { initLucia } from '$lib/server/lucia';
import { userTypes } from '$lib/utils/types/other';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';

export async function handle({ event, resolve }) {
	dayjs.extend(updateLocale);
	dayjs.extend(timezone);
	dayjs.updateLocale('en', {
		weekStart: 1
	});
	dayjs.extend(customParseFormat);

	const lucia = initLucia(event.platform);
	event.locals.lucia = lucia;
	const targetPath = event.url.pathname;

	if (routeIsPublic(event.url.pathname)) {
		return resolve(event);
	}
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	console.log('handle');
	if (!sessionId || !event.locals.userType) {
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
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	console.log('before');
	const clientCantVisitPage = targetPath.startsWith('/clients');
	if (event.locals.userType === userTypes.CLIENT && clientCantVisitPage) {
		return new Response(null, {
			status: 403,
			headers: { location: `/workouts` }
		});
	}
	console.log('after');
	return resolve(event);
}

export function routeIsPublic(route: string) {
	route = route.charAt(0) === '/' ? route.substring(1) : route;
	const publicRoutes = ['admin', 'login', 'signup'];
	return publicRoutes.some((publicRoute) => route.startsWith(publicRoute));
}
