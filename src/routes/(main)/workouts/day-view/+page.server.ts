import { activities, users, workouts } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { datesAreSameDay } from '$lib/utils/dates.js';
import dayjs from 'dayjs';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform, url }) {
	const date = dayjs(url.searchParams.get('date'), 'DD-MM-YYYY');

	const db = initDrizzle(platform);

	let foundWorkouts = await db
		.select()
		.from(activities)
		.leftJoin(workouts, eq(activities.id, workouts.activityId))
		.where(
			or(
				eq(activities.clientId, locals.user?.id ?? ''),
				eq(activities.trainerId, locals.user?.id ?? '')
			)
		)
		.orderBy(activities.startTimeDate);
	foundWorkouts = foundWorkouts.filter(({ activities: workout }) =>
		datesAreSameDay(workout.startTimeDate, date)
	);

	const combinedDetails = await Promise.all(
		foundWorkouts.map(async ({ activities }) => {
			const clientName = (
				await db
					.select({ name: users.name })
					.from(users)
					.limit(1)
					.where(eq(users.id, activities.clientId))
			)[0].name;

			return {
				...activities,
				clientName: clientName
			};
		})
	);

	return {
		workouts: combinedDetails
	};
}
