import { activities, clients, users, workouts, type Activity, type User } from '$lib/drizzleTables';
import { getTrainersClients, initDrizzle } from '$lib/server/utils';
import { dayjs } from '$lib/utils/dates';
import { dayOnlyFormat, userTypes, validMonthDate } from '$lib/utils/types/other.js';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';
import { yearSchema } from './schema.js';

export async function load(event) {
	if (!event.locals.user?.id || !event.locals.userType) return redirect(302, '/login');
	const monthString = event.url.searchParams.get('month');
	const month = validMonthDate.test(monthString ?? '')
		? dayjs(monthString, 'MM-YYYY').toDate()
		: dayjs().toDate();

	const db = initDrizzle(event.platform);
	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.innerJoin(workouts, eq(activities.id, workouts.id))
			.where(
				and(
					or(
						eq(activities.clientId, event.locals.user?.id),
						eq(activities.trainerId, event.locals.user?.id)
					),
					eq(workouts.date, month)
				)
			)
			.orderBy(workouts.date)
	).map((workout) => {
		return { ...workout.activities, date: workout.workouts.date };
	});

	let clientsInWorkoutsNames: string[] | null = null;
	let trainersClients: User[] | null = null;
	if (event.locals.userType === userTypes.TRAINER) {
		if (foundWorkouts.length === 0) clientsInWorkoutsNames = [];
		else {
			clientsInWorkoutsNames = [
				(
					await db
						.select({ name: users.name })
						.from(users)
						.innerJoin(clients, eq(clients.id, users.id))
						.where(eq(clients.id, foundWorkouts[0].clientId))
						.limit(1)
				)[0].name
			];
		}

		trainersClients = await getTrainersClients(db, event.locals.user.id);
	}

	const groupedWorkouts = new Map<
		string,
		(Activity & { clientsName: string | null; date: Date })[]
	>();
	foundWorkouts
		.map((workout, i) => {
			return {
				...workout,
				clientsName: clientsInWorkoutsNames ? clientsInWorkoutsNames[i] : null
			};
		})
		.forEach((workout) => {
			const dateKey = dayjs(workout.date).format(dayOnlyFormat);
			if (!groupedWorkouts.has(dateKey)) groupedWorkouts.set(dateKey, []);
			groupedWorkouts.get(dateKey)!.push(workout);
		});

	return {
		month,
		workouts: groupedWorkouts,
		userType: event.locals.userType,
		clients: trainersClients
	};
}

export const actions = {
	changeMonth: async ({ url, request }) => {
		const newMonth = (await request.formData()).get('newMonth')?.toString();
		if (!newMonth) return fail(400);

		const oldMonth = url.searchParams.get('month');
		const oldDate = validMonthDate.test(oldMonth ?? '') ? dayjs(oldMonth, 'MM-YYYY') : dayjs();

		return redirect(
			302,
			`/workouts?month=${dayjs(newMonth, 'MMMM').format('MM')}-${oldDate.format('YYYY')}`
		);
	},

	changeYear: async (event) => {
		const form = yearSchema.safeParse(Number((await event.request.formData()).get('newYear')));
		if (!form.success) return fail(400);

		const month = event.url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();

		return redirect(302, `/workouts?month=${monthDate.format('MM')}-${form.data}`);
	}
};
