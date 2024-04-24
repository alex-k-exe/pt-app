import { activities, clients, users, workouts } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { dayjs } from '$lib/utils/dates';
import { dayOnlyFormat, userTypes } from '$lib/utils/types/other';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';

export async function load({ locals, platform, url }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const date = url.searchParams.get('date')
		? dayjs(url.searchParams.get('date'), dayOnlyFormat).toDate()
		: dayjs().toDate();
	date.setHours(0, 0, 0, 0);
	const db = initDrizzle(platform);

	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.innerJoin(workouts, eq(activities.id, workouts.id))
			.where(
				and(
					or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id)),
					eq(workouts.date, date)
				)
			)
			.orderBy(activities.startTime)
	).map((workout) => {
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
		date,
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
