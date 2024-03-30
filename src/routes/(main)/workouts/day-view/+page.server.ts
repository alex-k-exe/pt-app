import * as schema from '$lib/drizzleTables';
import dayjs from 'dayjs';
import { and, eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

export async function load({ locals, platform, url }) {
	const date = dayjs(url.searchParams.get('date'), 'DD-MM-YYYY');

	if (!platform?.env.DB) throw new Error('Database is undefined');
	const db = drizzle(platform?.env.DB);

	const workouts = await db
		.select()
		.from(schema.workouts)
		.where(
			and(
				or(
					eq(schema.workouts.clientId, locals.user?.id ?? ''),
					eq(schema.workouts.trainerId, locals.user?.id ?? '')
				),
				eq(schema.workouts.startTimeDate, date.toString())
				// TODO: exclude workouts that are actually dailies
			)
		);

	const workoutsWithClientNames = await Promise.all(
		workouts.map(async (workout) => {
			const clientName = (
				await db
					.select({ name: schema.users.name })
					.from(schema.users)
					.where(eq(schema.users.id, workout.clientId))
			)[0].name;

			return {
				workout: workout,
				clientName: clientName
			};
		})
	);
	return {
		date: date.toString(),
		workouts: workoutsWithClientNames
	};
}
