import * as schema from '$lib/drizzleTables';
import { drizzle } from 'drizzle-orm/d1';
import { generateId } from 'lucia';

export async function GET({ cookies, platform, locals }) {
	if (!platform?.env.DB) throw new Error('DB is undefined');
	const db = drizzle(platform?.env.DB, { schema });

	const trainer: schema.User = {
		id: generateId(15),
		email: 'trainer@gmail.com',
		name: 'Duke Nukem',
		refreshToken: ''
	} as const;
	const client: schema.User = {
		id: generateId(15),
		email: 'pretendEmail@gmail.com',
		name: 'Jack Jack',
		refreshToken: ''
	} as const;

	await db.insert(schema.users).values([trainer, client]);
	await db.insert(schema.trainers).values({ id: trainer.id });
	await db.insert(schema.clients).values({ id: client.id, trainerId: trainer.id });

	const session = await locals.lucia.createSession(client.id, {});
	const sessionCookie = locals.lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	locals.user = trainer;
	locals.session = session;

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/workouts'
		}
	});
}
