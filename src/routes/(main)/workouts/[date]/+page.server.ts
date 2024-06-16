import { activities, clients, users, workouts } from '$lib/drizzleTables';
import { dayjs } from '$lib/utils/dates';
import { userTypes, validDate } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';

export async function load({ locals, params }) {
	if (!locals.user?.id) return redirect(302, '/login');
	// TODO: consider making date variable a route parameter
	const date = validDate.regex.test(params.date)
		? dayjs(params.date, validDate.format)
		: dayjs();

	const foundWorkouts = (
		await locals.db
			.select()
			.from(activities)
			.innerJoin(workouts, eq(activities.id, workouts.id))
			.where(
				and(
					or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id)),
					eq(workouts.date, date.format(validDate.format))
				)
			)
			.orderBy(workouts.startTime)
	).map((workout) => {
		return { ...workout.workouts, ...workout.activities };
	});

	let clientsNames: string[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		clientsNames = await Promise.all(
			foundWorkouts.map(async (workout) => {
				const client = await locals.db
					.select({ name: users.name })
					.from(users)
					.innerJoin(clients, eq(clients.id, users.id))
					.limit(1)
					.where(eq(users.id, workout.clientId));
				return client[0].name;
			})
		);
	}

	return {
		date: date.toDate(),
		workouts: foundWorkouts.map((workout, i) => {
			return { ...workout, clientsName: clientsNames ? clientsNames[i] : null };
		})
	};
}

export const actions = {
	default: async ({ locals, request }) => {
		const workoutId = (await request.formData()).get('workoutId');
		if (!workoutId) return fail(400);
		await locals.db.delete(activities).where(eq(activities.id, Number(workoutId.toString())));
	}
};
