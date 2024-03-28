import { getAuthVariables, getGoogleUser } from '$lib/server/auth';
import * as schema from '$lib/server/drizzleTables.ts';
import { google } from '$lib/server/lucia';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { generateId } from 'lucia';

export async function GET(event: RequestEvent): Promise<Response> {
	const authVariables = getAuthVariables(event);
	if (authVariables instanceof Response) return authVariables;

	const tokens = await google.validateAuthorizationCode(
		authVariables.state,
		authVariables.codeVerifier
	);
	const googleUser = await getGoogleUser(tokens.accessToken);

	if (!event.platform?.env.DB) throw new Error('DB is undefined');
	const db = drizzle(event.platform?.env.DB, { schema });

	let dbUser = (
		await db.select().from(schema.users).where(eq(schema.users.email, googleUser.email))
	)[0];

	if (!dbUser) {
		googleUser.id = generateId(15);
		dbUser = (await db.insert(schema.users).values(googleUser).returning())[0];
	}
	const session = await event.locals.lucia.createSession(dbUser.id, {});
	const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/workouts'
		}
	});
}
