import { initLucia } from '$lib/server/lucia';
import { UserType } from '$lib/utils/types/other';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('running hooks');
	const lucia = initLucia(event.platform);
	event.locals.lucia = lucia;
	console.log('set lucia');

	if (event.url.href.startsWith('/login')) return resolve(event);
	console.log('didnt go to login');
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) throw redirect(302, `/login?targetHref=${event.url.href}`);
	console.log(sessionId);

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

	const clientCantVisitPage = event.url.href.startsWith('/clients');
	const pageDoesntExist = event.url.href === '/';
	if ((event.locals.userType === UserType.CLIENT && clientCantVisitPage) || pageDoesntExist) {
		throw redirect(302, '/workouts');
	}
	return resolve(event);
};
