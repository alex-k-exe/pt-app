import { activities, series, sets, users, workouts, type Activity } from '$lib/drizzleTables';
import { getSeries, getTrainersClients } from '$lib/server/dbUtils.js';
import { dayjs } from '$lib/utils/dates';
import { userTypes, validDate, validTime } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, isNull } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { FormActivity } from '../schema.js';
import { formSchema } from './schema.js';

// If given, use the workoutId to get workout (i.e. Activity) along with its Series and Sets
// If User is a Trainer, find the names of their clients and attach the name of the client to the workout
// Otherwise make a new workout
export async function load({ url, locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const dateString = url.searchParams.get('date');
	const date = validDate.regex.test(dateString ?? '')
		? dayjs(dateString, validDate.format)
		: dayjs();

	const workoutId = url.searchParams.get('workoutId');
	let clientOfWorkoutName: string | null = null;
	const workout: FormActivity & {
		date: dayjs.Dayjs;
		startTime: dayjs.Dayjs;
		endTime: dayjs.Dayjs;
	} = (await getWorkout(workoutId, locals.db)) ?? {
		clientId: '',
		trainerId: locals.user.id, // only trainers can make a new workout
		title: '',
		date,
		startTime: dayjs(),
		endTime: dayjs(),
		series: [],
		sets: []
	};
	if (workoutId) {
		clientOfWorkoutName = (
			await locals.db
				.select({ name: users.name })
				.from(users)
				.limit(1)
				.where(eq(users.id, workout.clientId))
		)[0].name;
	}

	let trainersClients: { id: string; name: string }[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		trainersClients = await getTrainersClients(locals.db, locals.user.id);
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
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	insertOrUpdate: async (event) => {
		if (event.locals.userType !== userTypes.TRAINER) return fail(403);
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const db = event.locals.db;
		let dbActivity: Activity;
		if (form.data.id) {
			dbActivity = (
				await db
					.update(activities)
					.set(form.data)
					.where(eq(activities.id, form.data.id))
					.returning()
			)[0];
			await db.batch([
				db.update(workouts).set(form.data).where(eq(workouts.id, form.data.id)),
				db.delete(series).where(eq(series.id, dbActivity.id)),
				db.delete(sets).where(eq(sets.id, dbActivity.id))
			]);
		} else {
			dbActivity = (await db.insert(activities).values(form.data).returning())[0];
			await db.insert(workouts).values(form.data).returning();
		}
		form.data.series.forEach(async (formSeries) => {
			const dbSeries = (
				await db
					.insert(series)
					.values({ ...formSeries, activityId: dbActivity.id })
					.returning()
			)[0];

			formSeries.sets.forEach(async (formSet) => {
				await db
					.insert(sets)
					.values({ ...formSet, activityId: dbActivity.id, seriesId: dbSeries.id });
			});
		});

		return redirect(
			302,
			`/workouts/day-view?date=${dayjs(form.data.date).format(validDate.format)}`
		);
	},

	delete: async ({ locals, request }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const formData = await request.formData();
		const id = formData.get('workoutId');
		if (!id) return fail(400);

		await locals.db.delete(activities).where(eq(activities.id, Number(id)));

		const date = formData.get('date');
		return redirect(302, `/workouts/day-view?date=${dayjs(date?.toString(), validDate)}`);
	}
};

async function getWorkout(workoutId: string | number | null, db: DrizzleD1Database) {
	workoutId = Number(workoutId);
	if (!workoutId) return null;
	const dbWorkout = await db
		.select()
		.from(workouts)
		.innerJoin(activities, eq(activities.id, workouts.id))
		.limit(1)
		.where(eq(workouts.id, workoutId));
	if (dbWorkout.length === 0) return null;
	const workout: FormActivity & {
		date: dayjs.Dayjs;
		startTime: dayjs.Dayjs;
		endTime: dayjs.Dayjs;
	} = {
		date: dayjs(dbWorkout[0].workouts.date, validDate.format),
		startTime: dayjs(dbWorkout[0].workouts.startTime, validTime),
		endTime: dayjs(dbWorkout[0].workouts.endTime, validTime),
		...dbWorkout[0].activities,
		series: [],
		sets: []
	};
	workout.series = await getSeries(db, workoutId);
	workout.sets = await db
		.select()
		.from(sets)
		.orderBy(sets.index)
		.where(and(eq(sets.id, workoutId), isNull(sets.seriesId)));

	return workout;
}
