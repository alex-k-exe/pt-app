import * as schema from '$lib/drizzleTables';
import { getAuthVariables, getGoogleUser } from '$lib/server/auth';
import { google } from '$lib/server/lucia';
import { UserType } from '$lib/utils/types/other.js';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { generateId } from 'lucia';

export async function GET({ url, cookies, platform, locals }): Promise<Response> {
	const authVariables = getAuthVariables(url, cookies);
	if (authVariables === null) return new Response(null, { status: 400 });

	const tokens = await google.validateAuthorizationCode(
		authVariables.state,
		authVariables.codeVerifier
	);
	const googleUser = await getGoogleUser(tokens.accessToken);
	googleUser.refreshToken = tokens.refreshToken ?? '';

	if (!platform?.env.DB) throw new Error('DB is undefined');
	const db = drizzle(platform?.env.DB, { schema });

	let dbUser = (
		await db.select().from(schema.users).where(eq(schema.users.email, googleUser.email))
	)[0];

	if (!dbUser) {
		googleUser.id = generateId(15);
		dbUser = (await db.insert(schema.users).values(googleUser).returning())[0];
	}
	const session = await locals.lucia.createSession(dbUser.id, {});
	const sessionCookie = locals.lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	locals.user = dbUser;
	locals.session = session;

	const trainer = await db
		.select({})
		.from(schema.trainers)
		.limit(1)
		.where(eq(schema.trainers.id, dbUser.id));
	locals.userType = trainer.length > 0 ? UserType.TRAINER : UserType.CLIENT;

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/workouts'
		}
	});
}
