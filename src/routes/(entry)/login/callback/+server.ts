import { users } from '$lib/server/drizzleTables';
import * as schema from '$lib/server/drizzleTables.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { generateId } from 'lucia';
import wretch from 'wretch';

export async function GET(event: RequestEvent): Promise<Response> {
	// https://oauth2.example.com/callback#access_token=4/P7q7W91&token_type=Bearer&expires_in=3600
	const accessToken = event.url.searchParams.get('access_token');
	const possibleError = event.url.searchParams.get('error');

	if (!accessToken || possibleError) {
		return new Response(null, {
			status: 400
		});
	}

	const tokens = await google.validateAuthorizationCode(code, codeVerifier);

	const user = (await wretch(googleAuthURL)
		.headers({ Authorization: `Bearer ${tokens.accessToken}` })
		.get()
		.json()
		.catch((error) => {
			if (error instanceof OAuth2RequestError) {
				return new Response('Invalid code', {
					status: 400
				});
			}
			return new Response(null, { status: 500 });
		})) as schema.User;

	if (!event.platform?.env.DB) {
		throw new Error('Database is undefined');
	}
	const db = drizzle(event.platform?.env.DB, { schema });

	const existingUser = await db
		.select({ id: users.id, email: users.email })
		.from(users)
		.where(eq(users.id, user.id));

	if (existingUser) {
		const session = await lucia.createSession(existingUser[0].id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	} else {
		const userId = generateId(15);

		await db.insert(schema.users).values({ id: userId });

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
