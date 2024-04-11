import { initLucia } from '$lib/server/lucia';
import { UserType } from '$lib/utils/types/other';

export async function handle({ event, resolve }) {
	console.log('handle');
	if (event.request.headers.get('user-agent')?.includes('Cloudflare')) {
		// Skip executing logic during the build process
		return resolve(event);
	}

	const lucia = initLucia(event.platform);
	event.locals.lucia = lucia;
	const targetPath = event.url.pathname;

	if (routeIsPublic(event.url.pathname)) {
		return resolve(event);
	}
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return new Response(null, {
			status: 302,
			headers: { location: `/login?targetPath=${encodeURIComponent(targetPath)}` }
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

	const clientCantVisitPage = targetPath.startsWith('/clients');
	if (event.locals.userType === UserType.CLIENT && clientCantVisitPage) {
		return new Response(null, {
			status: 403,
			headers: { location: `/workouts` }
		});
	}
	return resolve(event);
}

export function routeIsPublic(route: string) {
	const publicRoutes = ['/admin', '/login', 'signup'];
	return publicRoutes.some((publicRoute) => route.startsWith(publicRoute));
}
