import { activities, workouts } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { datesAreSameDay } from '$lib/utils/dates.js';
import { dayOnlyFormat } from '$lib/utils/types/other';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform, url }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const date = dayjs(url.searchParams.get('date'), dayOnlyFormat);
	const db = initDrizzle(platform);

	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.leftJoin(workouts, eq(activities.id, workouts.activityId))
			.where(
				or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id))
			)
			.orderBy(activities.startTime)
	).filter(({ workouts: workout }) => {
		if (!workout) return false;
		datesAreSameDay(dayjs(workout.date), date);
	});

	return {
		date: date.toISOString(),
		workouts: foundWorkouts
	};
}
