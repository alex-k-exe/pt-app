import { initLucia } from '$lib/server/lucia';
import { UserType } from '$lib/utils/types/other';

export async function handle({ event, resolve }) {
	console.log('s');
	const lucia = initLucia(event.platform);
	console.log('inited');
	event.locals.lucia = lucia;
	console.log('thingo3', lucia.createBlankSessionCookie());
	const targetPath = event.url.pathname;

	if (
		targetPath.startsWith('/admin') ||
		targetPath.startsWith('/login') ||
		targetPath.startsWith('/signup')
	) {
		return resolve(event);
	}
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
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
