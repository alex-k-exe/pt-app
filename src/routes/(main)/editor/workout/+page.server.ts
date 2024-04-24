import {
	activities,
	series,
	sets,
	users,
	workouts,
	type Activity,
	type Series,
	type Workout
} from '$lib/drizzleTables';
import { getSeries, getTrainersClients, initDrizzle } from '$lib/server/utils';
import { dayjs } from '$lib/utils/dates';
import { dayOnlyFormat, userTypes } from '$lib/utils/types/other';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, isNull } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { FormActivity } from '../schema.js';
import { formSchema } from './schema.js';

// If given, use the workoutId to get workout (i.e. Activity) along with its Series and Sets
// If User is a Trainer, find the names of their clients and attach the name of the client to the workout
// Otherwise make a new workout
export async function load({ url, locals, platform }) {
	const dateString = url.searchParams.get('date');
	let date = dayjs(dateString, 'MM-YYYY').toDate();
	if (date.toString() === 'Invalid date') date = dayjs().toDate();

	const workoutId = Number(url.searchParams.get('workoutId'));
	if (!locals.user?.id) return redirect(302, '/login');
	let workout: FormActivity & { date: Date } = {
		clientId: '',
		trainerId: locals.user?.id, // only trainers can make a new workout
		title: '',
		date,
		startTime: new Date(),
		endTime: new Date(),
		series: [],
		sets: []
	};
	let clientOfWorkoutName: string = '';

	const db = initDrizzle(platform);
	if (workoutId) {
		workout = {
			...(
				await db
					.select()
					.from(workouts)
					.innerJoin(activities, eq(activities.id, workouts.id))
					.limit(1)
					.where(eq(workouts.id, workoutId))
			)
				.filter((workout): workout is { activities: Activity; workouts: Workout } => {
					return workout.activities !== null;
				})
				.map((workout) => {
					return { date: workout.workouts.date, ...workout.activities };
				})[0],
			series: [],
			sets: []
		};
		workout.series = await getSeries(db, workoutId);
		workout.sets = await db
			.select()
			.from(sets)
			.orderBy(sets.index)
			.where(and(eq(sets.id, workoutId), isNull(sets.seriesId)));

		clientOfWorkoutName = (
			await db
				.select({ name: users.name })
				.from(users)
				.limit(1)
				.where(eq(users.id, workout.clientId))
		)[0].name;
	}

	let trainersClients: { id: string; name: string }[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		trainersClients = (await getTrainersClients(db, locals.user.id)).map((client) => client.users);
		if (trainersClients.length === 0) {
			return redirect(
				302,
				'/clients?error=You must have atleast one client to create a workout or daily'
			);
		}
	}

	return {
		workout: { ...workout, clientName: clientOfWorkoutName },
		trainersClients,
		userType: locals.userType,
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	insertOrUpdate: async (event) => {
		if (event.locals.userType !== userTypes.TRAINER) return fail(403);
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });
		form.data.date.setHours(0, 0, 0, 0);

		const db = initDrizzle(event.platform);
		let dbActivity: Activity;
		if (form.data.id) {
			dbActivity = (
				await db.select().from(activities).limit(1).where(eq(activities.id, form.data.id))
			)[0];
		} else {
			dbActivity = (await db.insert(activities).values(form.data).returning())[0];
			await db.insert(workouts).values({ id: dbActivity.id, date: form.data.date });
		}
		form.data.series.forEach(async (formSeries, i) => {
			formSeries.index = i;

			let dbSeries: Series;
			dbSeries = (
				await db
					.insert(series)
					.values({ ...formSeries, id: dbActivity.id })
					.returning()
			)[0];

			formSeries.sets.forEach(async (formSet, j) => {
				formSet.index = j;
				await db.insert(sets).values({ ...formSet, id: dbActivity.id, seriesId: dbSeries.id });
			});
		});

		return redirect(302, `/workouts/day-view?date=${dayjs(form.data.date).format(dayOnlyFormat)}`);
	},

	delete: async ({ locals, platform, url }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const id = url.searchParams.get('workoutId');
		if (!id) return fail(400);

		await initDrizzle(platform)
			.delete(activities)
			.where(eq(activities.id, Number(id)));

		const date = url.searchParams.get('date');
		return redirect(302, '/workouts' + date ? `?month=${date}` : '');
	}
};
