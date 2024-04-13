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
import { arrayToTuple } from '$lib/utils/other.js';
import { userTypes } from '$lib/utils/types/other.js';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { and, eq, or } from 'drizzle-orm';

export async function load({ url, platform, locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const month = dayjs(url.searchParams.get('month'), 'MM-YYYY');
	const db = initDrizzle(platform);
	// startTime: integer('startTime', { mode: 'timestamp' }).notNull(),
	// 	endTime: integer('endTime', { mode: 'timestamp' }).notNull()
	// 	title: text('name').notNull(),
	// 	id: integer('id').primaryKey({ autoIncrement: true }),
	// 	date: integer('date', { mode: 'timestamp' }).notNull()
	const foundWorkouts = (
		await db
			.select()
			.from(activities)
			.leftJoin(workouts, eq(activities.id, workouts.activityId))
			.where(
				and(
					or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id)),
					eq(workouts.date, month.toDate())
				)
			)
			.orderBy(activities.startTime)
	)
		.filter((workout): workout is { activities: Activity; workouts: Workout } => workout !== null)
		.map((workout) => {
			return { ...workout.activities, ...workout.workouts };
		});

	let clientsInWorkoutsNames: string[] | null = null;
	let clientsNames: string[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		const getClientsInWorkoutsNames = foundWorkouts.map((workout) =>
			db
				.select({ name: users.name })
				.from(users)
				.leftJoin(clients, eq(clients.id, users.id))
				.where(eq(clients.id, workout.clientId))
				.limit(1)
		);
		clientsInWorkoutsNames = (await db.batch(arrayToTuple(getClientsInWorkoutsNames))).map(
			(name) => name[0].name
		);

		clientsNames = (await getTrainersClients(db, locals.user.id))
			.filter((user): user is { users: User; clients: Client } => user !== null)
			.map((user) => user.users.name);
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
		clientsNames
	};
}
