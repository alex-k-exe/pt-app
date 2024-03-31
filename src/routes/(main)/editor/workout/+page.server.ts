import { activities, series, sets, workouts } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';

// If given, use the workoutId to get workout (i.e. Activity) along with its Series and Sets
// Otherwise make a new workout
export async function load({ url, locals, platform }) {
	const date = dayjs(url.searchParams.get('date'));
	const workoutId = Number(url.searchParams.get('workoutId'));

	let workout: WorkoutWithSeries;
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
	} else {
		workout = {
			clientId: '',
			trainerId: locals.user?.id ?? '', // only trainers can make a new workout
			date: date.toString(),
			startTime: '',
			endTime: ''
		};
	}

	return {
		workout: workout,
		userType: locals.userType
	};
}

export const actions = {
	// put fixing up the series.index things when handling the save action
	// save (insert), save (edit), delete
	insert: async ({ platform, request }) => {
		const db = initDrizzle(platform);
	},

	edit: async ({ platform, request }) => {},

	delete: async ({ cookies, request }) => {
		const data = await request.formData();
		db.deleteTodo(cookies.get('userid'), data.get('id'));
	}
};
