import { activities, clients, series, sets, users, workouts } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { UserType, type WorkoutWithSeries } from '$lib/utils/types/other';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { RouteParams } from './$types';
import { formSchema } from './schema';

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
		date: date.toString(),
		startTime: '',
		endTime: ''
	};
	let clientOfWorkoutName: string = '';

	// TODO: break this mess into some functions
	if (workoutId) {
		const db = initDrizzle(platform);
		workout = {
			...(
				await db
					.select()
					.from(workouts)
					.innerJoin(activities, eq(activities.id, workouts.activityId))
					.limit(1)
					.where(eq(workouts.activityId, workoutId))
			)[0].activities
		};
		workout.series = await db
			.select()
			.from(series)
			.where(eq(series.workoutId, workoutId.toString()));
		workout.series = await Promise.all(
			workout.series.map(async (series) => {
				return {
					...series,
					sets: await db.select().from(sets).where(eq(sets.seriesId, series.id))
				};
			})
		);
		workout.sets = await db.select().from(sets).where(eq(series.workoutId, workoutId.toString()));
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
	// put fixing up the series.index things when handling the save action
	insert: async (event) => {
		const form = await validateForm(event);
		if (!('valid' in form) || !form.data.id) return form;

		const db = initDrizzle(event.platform);
		await db.insert(activities).values(form.data);
		await db.insert(workouts).values({ activityId: form.data.id });
	},

	update: async (event) => {
		const form = await validateForm(event);
		if (!('valid' in form) || !form.data.id) return form;

		const db = initDrizzle(event.platform);
		db.update(activities).set(form.data).where(eq(activities.id, form.data.id));
	},

	delete: async (event) => {
		const form = await validateForm(event);
		if (!('valid' in form) || !form.data.id) return form;

		const db = initDrizzle(event.platform);
		await db.delete(activities).where(eq(activities.id, form.data.id));
		await db.delete(workouts).where(eq(workouts.activityId, form.data.id));
	}
};
