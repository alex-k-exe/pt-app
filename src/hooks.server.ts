import { initLucia } from '$lib/server/lucia';
import { userTypes } from '$lib/utils/types';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { type Handle } from '@sveltejs/kit';
import { seed } from 'drizzle-seed';
import { populateDatabase } from '$lib/server/dbUtils';
import { count, sql } from 'drizzle-orm';
import { users } from './lib/drizzleTables';

export const handle: Handle = async ({ event, resolve }) => {
	const sqlite = new Database('./local.db');
	event.locals.sqliteDB = sqlite;
	const db = drizzle(sqlite);
	event.locals.db = db;

	const tables = await db
		.select({ name: sql<string>`name` })
		.from(sql`sqlite_master`)
		.where(
			sql`type = 'table'
    AND name NOT LIKE 'sqlite_%'`
		);
	if ((await db.select({ count: count() }).from(users))[0].count === 0) {
		await populateDatabase(db);
	}
	const lucia = initLucia(event.locals.sqliteDB);
	event.locals.lucia = lucia;

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
			status: 403,
			headers: { location: `/workouts` }
		});
	}
	return resolve(event);
};

export function routeIsPublic(route: string) {
	route = route.charAt(0) === '/' ? route.substring(1) : route;
	const publicRoutes = ['admin', 'login', 'signup'];
	return publicRoutes.some((publicRoute) => route.startsWith(publicRoute));
}
