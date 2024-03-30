import * as schema from '$lib/drizzleTables';
import dayjs from 'dayjs';
import { and, eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

export async function load({ locals, platform, url }) {
	const date = dayjs(url.searchParams.get('date'), 'DD-MM-YYYY');

	if (!platform?.env.DB) throw new Error('Database is undefined');
	const db = drizzle(platform?.env.DB);

	let workouts: schema.Workout[];
	let clientsNames: string[];
	try {
		workouts = await db
			.select()
			.from(schema.workouts)
			.where(
				and(
					or(
						eq(schema.workouts.clientId, locals.user?.id ?? ''),
						eq(schema.workouts.trainerId, locals.user?.id ?? '')
					),
					eq(schema.workouts.startTimeDate, date.toString()),
					!eq(, '')
				)
			);

		clientsNames = await Promise.all(
			workouts.map(
				async (workout) =>
					(
						await db
							.select({ name: schema.users.name })
							.from(schema.users)
							.where(eq(schema.clients.id, workout.clientId))
					)[0].name
			)
		);
	} catch (error: unknown) {
		console.log({ error: 'Unknown error' });
		workouts = [];
		clientsNames = [];
	}
	return {
		date: date.toString(),
		workouts: workouts,
		clientsNames: clientsNames
	};
}
