import { clients, trainers, users } from '$lib/drizzleTables';
import { initLucia } from '$lib/server/lucia';
import { initDrizzle } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';

export async function load({ platform, locals, cookies }) {
	const db = initDrizzle(platform);

	await db.batch([db.delete(clients), db.delete(trainers), db.delete(users)]);
	const trainer = (
		await db
			.insert(users)
			.values({ name: 'Duke Nukem', email: 'ptappteam@gmail.com', password: 'temp' })
			.returning()
	)[0];
	const trainer2 = (
		await db
			.insert(users)
			.values({ name: 'Daddy Noel', email: 'chad@chad.org', password: 'swole' })
			.returning()
	)[0];
	const client = (
		await db
			.insert(users)
			.values({ name: 'Joe Pesci', email: 'blah@gmail.com', password: 'uh' })
			.returning()
	)[0];

	await db.batch([
		db.insert(trainers).values([{ id: trainer.id }, { id: trainer2.id }]),
		db.insert(clients).values({ id: client.id, trainerId: trainer.id })
	]);

	const lucia = initLucia(platform);
	locals.lucia = lucia;

	const session = await lucia.createSession(trainer.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	locals.user = trainer;
	locals.session = session;

	return redirect(302, '/workouts');
}
