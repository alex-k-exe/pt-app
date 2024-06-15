import { activities, series, sets, users, workouts, type Activity } from '$lib/drizzleTables';
import { getTrainersClients, getWorkout } from '$lib/server/dbUtils.js';
import { dayjs } from '$lib/utils/dates';
import { userTypes, validDate, validTime } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema, type FormWorkout } from './schema.js';

// If given, use the workoutId to get workout (i.e. Activity) along with its Series and Sets
// If User is a Trainer, find the names of their clients and attach the name of the client to the workout
// Otherwise make a new workout
export async function load({ url, locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
	// TODO: consider putting the date or workoutId as route parameters
	const dateUrl = url.searchParams.get('date');
	const dateString =
		validDate.regex.test(dateUrl ?? '') && dateUrl !== null
			? dateUrl
			: dayjs().format(validDate.format);

	const workoutId = url.searchParams.get('workoutId');
	const workout: FormWorkout = (await getWorkout(workoutId, locals.db)) ?? {
		clientId: '',
		trainerId: locals.user.id, // only trainers can make a new workout
		title: '',
		date: dateString,
		startTime: dayjs().format(validTime),
		endTime: dayjs().add(1, 'hour').format(validTime),
		series: []
	};

	let clientOfWorkoutName: string | null = null;
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
		console.log(0, form.data);
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
				db.delete(series).where(eq(series.activityId, dbActivity.id))
			]);
		} else {
			dbActivity = (await db.insert(activities).values(form.data).returning())[0];
			await db
				.insert(workouts)
				.values({ id: dbActivity.id, date: 'Invaldid yeeeh', startTime: 'smdm', endTime: 'smd' });
		}
		console.log(1, dbActivity);
		form.data.series.forEach(async (formSeries) => {
			const dbSeries = (
				await db
					.insert(series)
					.values({ ...formSeries, activityId: dbActivity.id })
					.returning()
			)[0];
			console.log('ew', dbSeries);
			formSeries.sets.map(async (formSet) => {
				await db.insert(sets).values({ ...formSet, seriesId: dbSeries.id });
			});
		});
		return redirect(302, '/workouts');
	},

	delete: async ({ request, locals }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const id = (await request.formData()).get('id');
		if (!id) return fail(500);

		await locals.db.delete(activities).where(eq(activities.id, Number(id.toString())));
	}
};
