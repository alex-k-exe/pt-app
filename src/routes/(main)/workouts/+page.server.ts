import {
	activities,
	clients,
	users,
	workouts,
	type Activity,
	type Client,
	type User,
	type Workout
} from '$lib/drizzleTables';
import { getTrainersClients, initDrizzle } from '$lib/server/utils';
import { dayOnlyFormat, userTypes, validMonthDate } from '$lib/utils/types/other.js';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { and, eq, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { yearSchema } from './schema.js';

export async function load(event) {
	if (!event.locals.user?.id || !event.locals.userType) return redirect(302, '/login');
	const monthString = event.url.searchParams.get('month');
	const month = monthString?.match(validMonthDate)
		? dayjs(event.url.searchParams.get('month'), 'MM-YYYY')
		: dayjs();

	const db = initDrizzle(event.platform);
	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.innerJoin(workouts, eq(activities.id, workouts.activityId))
			.where(
				and(
					or(
						eq(activities.clientId, event.locals.user?.id),
						eq(activities.trainerId, event.locals.user?.id)
					),
					eq(workouts.date, month.toDate())
				)
			)
			.orderBy(workouts.date)
	)
		.filter((workout): workout is { activities: Activity; workouts: Workout } => workout !== null)
		.map((workout) => {
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

		trainersClients = (await getTrainersClients(db, event.locals.user.id))
			.filter((user): user is { users: User; clients: Client } => user !== null)
			.map((user) => {
				return user.users;
			});
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
		month: month.toDate(),
		workouts: groupedWorkouts,
		userType: event.locals.userType,
		clients: trainersClients,
		changeYearForm: await superValidate(event, zod(yearSchema))
	};
}

export const actions = {
	previousMonth: async ({ url }) => {
		const month = url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();
		return redirect(302, `/workouts?month=${monthDate.subtract(1, 'month').format('MM-YYYY')}`);
	},

	changeMonth: async ({ url, request }) => {
		const newMonth = (await request.formData()).get('newMonth')?.toString();
		if (!newMonth) return fail(400);

		const oldMonth = url.searchParams.get('month');
		const oldDate = oldMonth ? dayjs(oldMonth, 'MM-YYYY') : dayjs();

		return redirect(
			302,
			`/workouts?month=${dayjs(newMonth, 'MMMM').format('MM')}-${oldDate.format('YYYY')}`
		);
	},

	nextMonth: async ({ url }) => {
		const month = url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();
		return redirect(302, `/workouts?month=${monthDate.add(1, 'month').format('MM-YYYY')}`);
	},

	changeYear: async (event) => {
		let form = await superValidate(event, zod(yearSchema));
		if (!form.valid) return fail(400, { form });

		const month = event.url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();

		return redirect(302, `/workouts?month=${monthDate.format('MM')}-${form.data.newYear}`);
	}
};
