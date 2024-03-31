import { activities, users, workouts } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { datesAreSameDay } from '$lib/utils/dates.js';
import { dayOnlyFormat } from '$lib/utils/types/other';
import dayjs from 'dayjs';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform, url }) {
	const date = dayjs(url.searchParams.get('date'), dayOnlyFormat);

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
		.orderBy(activities.startTime);
	foundWorkouts = foundWorkouts.filter(({ activities: workout }) =>
		datesAreSameDay(dayjs(workout.date), date)
	);

	const combinedDetails = await Promise.all(
		foundWorkouts.map(async ({ activities: workout }) => {
			const clientName = (
				await db
					.select({ name: users.name })
					.from(users)
					.limit(1)
					.where(eq(users.id, workout.clientId))
			)[0].name;

			return {
				...workout,
				clientName: clientName
			};
		})
	);

	return {
		date: date,
		workouts: combinedDetails
	};
}
