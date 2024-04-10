import {
	activities,
	clients,
	series,
	sets,
	users,
	workouts,
	type Activity,
	type Series,
	type Workout
} from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { UserType, type WorkoutWithSeries } from '$lib/utils/types/other';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '../schema';

// If given, use the workoutId to get workout (i.e. Activity) along with its Series and Sets
// If User is a Trainer, find the names of their clients and attach the name of the client to the workout
// Otherwise make a new workout
export async function load({ url, locals, platform }) {
	const date = dayjs(url.searchParams.get('date'));
	const workoutId = Number(url.searchParams.get('workoutId'));

	if (!locals.user?.id) throw redirect(400, '/login');
	let workout: WorkoutWithSeries = {
		clientId: '',
		trainerId: locals.user?.id, // only trainers can make a new workout
		title: '',
		date: date.toISOString(),
		startTime: '',
		endTime: ''
	};
	let clientOfWorkoutName: string = '';

	// TODO: break this mess into some functions
	if (workoutId) {
		const db = initDrizzle(platform);
		workout = (
			await db
				.select()
				.from(workouts)
				.leftJoin(activities, eq(activities.id, workouts.activityId))
				.limit(1)
				.where(eq(workouts.activityId, workoutId))
		)
			.filter((workout): workout is { activities: Activity; workouts: Workout } => {
				return workout.activities !== null;
			})
			.map((workout) => {
				return { date: workout.workouts.date, ...workout.activities };
			})[0];
		workout.series = await db
			.select()
			.from(series)
			.orderBy(series.index)
			.where(eq(series.activityId, workoutId));
		workout.series = await Promise.all(
			workout.series.map(async (series) => {
				return {
					...series,
					sets: await db.select().from(sets).orderBy(sets.index).where(eq(sets.seriesId, series.id))
				};
			})
		);
		workout.sets = await db
			.select()
			.from(sets)
			.orderBy(sets.index)
			.where(eq(series.activityId, workoutId));
		clientOfWorkoutName = (
			await db
				.select({ name: users.name })
				.from(users)
				.limit(1)
				.where(eq(users.id, workout.clientId))
		)[0].name;
	}

	let clientNames: { id: string; name: string }[];
	if (locals.userType === UserType.TRAINER) {
		const db = initDrizzle(platform);
		clientNames = await db
			.select({ id: users.id, name: users.name })
			.from(clients)
			.limit(1)
			.innerJoin(users, eq(clients.id, users.id))
			.where(eq(clients.trainerId, locals.user?.id));
	} else clientNames = [];

	return {
		workout: { ...workout, clientName: clientOfWorkoutName },
		clientNames: clientNames,
		userType: locals.userType,
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	insertOrUpdate: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const db = initDrizzle(event.platform);
		let dbActivity: Activity;
		if (form.data.id) {
			dbActivity = (
				await db.select().from(activities).limit(1).where(eq(activities.id, form.data.id))
			)[0];
		} else {
			dbActivity = (await db.insert(activities).values(form.data).returning())[0];
			await db.insert(workouts).values({ activityId: dbActivity.id, date: form.data.date });
		}
		form.data.series.forEach(async (formSeries, i) => {
			formSeries.index = i;
			formSeries.activityId = dbActivity.id;

			let dbSeries: Series;
			if (formSeries.id) {
				dbSeries = (
					await db.update(series).set(formSeries).where(eq(series.id, formSeries.id)).returning()
				)[0];
			} else {
				dbSeries = (await db.insert(series).values(formSeries).returning())[0];
			}

			formSeries.sets.forEach(async (formSet, j) => {
				formSet.index = j;
				if (formSet.id) {
					await db
						.update(sets)
						.set({ ...formSet, seriesId: dbSeries.id })
						.where(eq(sets.id, formSet.id));
				} else {
					await db.insert(sets).values({ ...formSet, seriesId: dbSeries.id });
				}
			});
		});
	},

	delete: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		const id = form.data.id;
		if (!id) return fail(500, { form });
		if (!form.valid) return fail(400, { form });

		const db = initDrizzle(event.platform);
		await db.batch([
			db.delete(activities).where(eq(activities.id, id)),
			db.delete(workouts).where(eq(workouts.activityId, id)),
			db.delete(series).where(eq(series.activityId, id)),
			db.delete(sets).where(eq(sets.activityId, id))
		]);
	}
};
