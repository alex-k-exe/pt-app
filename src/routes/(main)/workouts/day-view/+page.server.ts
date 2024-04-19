import {
	activities,
	clients,
	users,
	workouts,
	type Activity,
	type Workout
} from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { datesAreSameDay } from '$lib/utils/dates.js';
import { dayOnlyFormat, userTypes } from '$lib/utils/types/other';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform, url }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const date = url.searchParams.get('date')
		? dayjs(url.searchParams.get('date'), dayOnlyFormat)
		: dayjs();
	const db = initDrizzle(platform);

	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.innerJoin(workouts, eq(activities.id, workouts.activityId))
			.where(
				or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id))
			)
			.orderBy(activities.startTime)
	)
		.filter((workout): workout is { activities: Activity; workouts: Workout } => {
			if (workout.workouts === null) return false;
			return !datesAreSameDay(dayjs(workout.workouts.date), date);
		})
		.map((workout) => {
			return { ...workout.workouts, ...workout.activities };
		});

	let clientsNames: string[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		if (foundWorkouts.length === 0) clientsNames = [];
		else
			clientsNames = [
				(
					await db
						.select({ name: users.name })
						.from(users)
						.innerJoin(clients, eq(clients.id, users.id))
						.limit(1)
						.where(eq(users.id, foundWorkouts[0].clientId))
				)[0].name
			];
	}

	return {
		date: date.toDate(),
		workouts: foundWorkouts.map((workout, i) => {
			return { ...workout, clientsName: clientsNames ? clientsNames[i] : null };
		})
	};
}

export const actions = {
	delete: async ({ platform, request }) => {
		const workoutId = (await request.formData()).get('workoutId');
		if (!workoutId) return fail(400);
		await initDrizzle(platform)
			.delete(activities)
			.where(eq(activities.id, Number(workoutId.toString())));
	}
};
