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
import { userTypes } from '$lib/utils/types/other.js';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { and, eq, or } from 'drizzle-orm';

export async function load({ url, platform, locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const month = url.searchParams.get('month')
		? dayjs(url.searchParams.get('month'), 'MM-YYYY')
		: dayjs();
	const clientId = url.searchParams.get('clientId');

	const db = initDrizzle(platform);
	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.leftJoin(workouts, eq(activities.id, workouts.activityId))
			.where(
				and(
					or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id)),
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
	if (locals.userType === userTypes.TRAINER) {
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

		trainersClients = (await getTrainersClients(db, locals.user.id))
			.filter((user): user is { users: User; clients: Client } => user !== null)
			.map((user) => {
				return user.users;
			});
	}

	return {
		month: month.toDate(),
		workouts: foundWorkouts.map((workout, i) => {
			return {
				...workout,
				clientsName: clientsInWorkoutsNames ? clientsInWorkoutsNames[i] : null
			};
		}),
		userType: locals.userType,
		trainersClients
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
		console.log(monthDate.format('D MMMM YYYY'));
		return redirect(
			302,
			`/workouts?month=${monthDate.subtract(1, 'months').format('MM-YYYY')}` +
				(clientId ? `&clientId=${clientId}` : '')
		);
	},

	changeMonth: async ({ url, request }) => {
		const newMonth = (await request.formData()).get('newMonth')?.toString();
		if (!newMonth) return fail(500);
		const oldMonth = url.searchParams.get('month');
		const oldDate = oldMonth ? dayjs(oldMonth, 'MM-YYYY') : dayjs();
		const clientId = url.searchParams.get('clientId');
		console.log(newMonth);

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

	changeYear: async ({ url, request }) => {
		const newYear = (await request.formData()).get('newYear');
		if (!newYear) return fail(400);

		const clientId = url.searchParams.get('clientId');
		const month = url.searchParams.get('month');
		const monthDate = month ? dayjs(month, 'MM-YYYY') : dayjs();

		return redirect(
			302,
			`/workouts?month=${monthDate.format('MM')}-${newYear}` +
				(clientId ? `&clientId=${clientId}` : '')
		);
	},

	today: async ({ url }) => {
		const clientId = url.searchParams.get('clientId');
		return redirect(302, `/workouts` + (clientId ? `?clientId=${clientId}` : ''));
	}
};
