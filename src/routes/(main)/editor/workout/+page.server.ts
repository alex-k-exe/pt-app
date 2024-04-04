import {
	activities,
	clients,
	series,
	sets,
	users,
	workouts,
	type Activity,
	type Workout
} from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { UserType, type WorkoutWithSeries } from '$lib/utils/types/other';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '../schema';
import type { RouteParams } from './$types';

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
		date: date.toString(),
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
		workout.series = await db.select().from(series).where(eq(series.workoutId, workoutId));
		workout.series = await Promise.all(
			workout.series.map(async (series) => {
				return {
					...series,
					sets: await db.select().from(sets).where(eq(sets.seriesId, series.id))
				};
			})
		);
		workout.sets = await db.select().from(sets).where(eq(series.workoutId, workoutId));
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

async function validateForm(event: RequestEvent<RouteParams, '/(main)/editor/workout'>) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(form.data.id ? 400 : 500, { form });
	return form;
}

export const actions = {
	// TODO: put fixing up the series.index things when handling the insertOrUpdate action, also assign workoutId to sets and series
	insertOrUpdate: async (event) => {
		console.log('insertOrUpdate');
		const form = await validateForm(event);
		if (!('valid' in form)) return form;

		const db = initDrizzle(event.platform);
		if (form.data.id) {
			await db.update(activities).set(form.data).where(eq(activities.id, form.data.id));
		} else {
			const workout = (await db.insert(activities).values(form.data).returning())[0];
			await db.insert(workouts).values({ activityId: workout.id, date: form.data.date });
		}
	},

	delete: async (event) => {
		console.log('delete');
		const form = await validateForm(event);
		if (!('valid' in form) || !form.data.id) return form;

		const db = initDrizzle(event.platform);
		db.delete(activities).where(eq(activities.id, form.data.id));
		await db.delete(workouts).where(eq(workouts.activityId, form.data.id));
	}
};
