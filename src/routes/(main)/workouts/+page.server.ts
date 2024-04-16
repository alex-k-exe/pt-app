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
import { userTypes, validDate } from '$lib/utils/types/other.js';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { and, eq, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { yearSchema } from './schema.js';

export async function load(event) {
	if (!event.locals.user?.id || !event.locals.userType) return redirect(302, '/login');
	const monthString = event.url.searchParams.get('month');
	const month = monthString?.match(validDate)
		? dayjs(event.url.searchParams.get('month'), 'MM-YYYY')
		: dayjs();
	const clientId = event.url.searchParams.get('clientId');

	const db = initDrizzle(event.platform);
	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.leftJoin(workouts, eq(activities.id, workouts.activityId))
			.where(
				and(
					or(
						eq(activities.clientId, event.locals.user?.id),
						eq(activities.trainerId, event.locals.user?.id)
					),
					eq(workouts.date, month.toDate()),
					clientId ? eq(activities.clientId, clientId) : eq(activities.id, activities.id)
				)
			)
			.orderBy(activities.startTime)
	)
		.filter((workout): workout is { activities: Activity; workouts: Workout } => workout !== null)
		.map((workout) => {
			return { ...workout.activities, ...workout.workouts };
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
						.leftJoin(clients, eq(clients.id, users.id))
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

	return {
		month: month.set('date', 1).toDate(),
		workouts: foundWorkouts.map((workout, i) => {
			return {
				...workout,
				clientsName: clientsInWorkoutsNames ? clientsInWorkoutsNames[i] : null
			};
		}),
		userType: event.locals.userType,
		trainersClients,
		changeYearForm: await superValidate(event, zod(yearSchema))
	};
}

export const actions = {
	searchForClient: async ({ url, request }) => {
		const clientId = (await request.formData()).get('clientId');
		if (!clientId) return fail(500);
		const month = url.searchParams.get('month');
		return redirect(302, `/workouts?clientId=${clientId}` + (month ? `&month=${month}` : ''));
	},

	previousMonth: async ({ url }) => {
		const clientId = url.searchParams.get('clientId');
		const month = url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();
		return redirect(
			302,
			`/workouts?month=${monthDate.subtract(1, 'months').format('MM-YYYY')}` +
				(clientId ? `&clientId=${clientId}` : '')
		);
	},

	changeMonth: async ({ url, request }) => {
		const newMonth = (await request.formData()).get('newMonth')?.toString();
		if (!newMonth) return fail(400);

		const oldMonth = url.searchParams.get('month');
		const oldDate = oldMonth ? dayjs(oldMonth, 'MM-YYYY') : dayjs();
		const clientId = url.searchParams.get('clientId');

		return redirect(
			302,
			`/workouts?month=${dayjs(newMonth, 'MMMM').format('MM')}-${oldDate.format('YYYY')}` +
				(clientId ? `&clientId=${clientId}` : '')
		);
	},

	nextMonth: async ({ url }) => {
		const clientId = url.searchParams.get('clientId');
		const month = url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();
		return redirect(
			302,
			`/workouts?month=${monthDate.add(1, 'months').format('MM-YYYY')}` +
				(clientId ? `&clientId=${clientId}` : '')
		);
	},

	changeYear: async (event) => {
		let form = await superValidate(event, zod(yearSchema));
		if (!form.valid) return fail(400, { form });

		const clientId = event.url.searchParams.get('clientId');
		const month = event.url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();

		return redirect(
			302,
			`/workouts?month=${monthDate.format('MM')}-${form.data.newYear}` +
				(clientId ? `&clientId=${clientId}` : '')
		);
	},

	today: async ({ url }) => {
		const clientId = url.searchParams.get('clientId');
		return redirect(302, `/workouts` + (clientId ? `?clientId=${clientId}` : ''));
	}
};
