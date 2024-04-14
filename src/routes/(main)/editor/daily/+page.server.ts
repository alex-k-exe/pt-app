import {
	activities,
	clients,
	dailies,
	series,
	sets,
	users,
	type Activity,
	type Daily,
	type Series
} from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { userTypes } from '$lib/utils/types/other';
import { type DailyWithSeries } from '$lib/utils/types/other.ts';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSeries } from '../../../../lib/server/db';
import { formSchema } from './schema';

// If given, use the dailyId to get daily (i.e. Activity) along with its Series and Sets
// If User is a Trainer, find the names of their clients and attach the name of the client to the daily
// Otherwise make a new daily
export async function load({ url, locals, platform }) {
	const dailyId = Number(url.searchParams.get('dailyId'));

	if (!locals.user?.id) return redirect(302, '/login');
	let daily: DailyWithSeries = {
		activeDays: '',
		clientId: '',
		trainerId: locals.user?.id, // only trainers can make a new daily
		title: '',
		startTime: new Date(),
		endTime: new Date(),
		series: [],
		sets: []
	};

	let clientOfDailyName: string = '';
	if (dailyId) {
		const db = initDrizzle(platform);
		daily = {
			...(
				await db
					.select()
					.from(dailies)
					.leftJoin(activities, eq(activities.id, dailies.activityId))
					.limit(1)
					.where(eq(dailies.activityId, dailyId))
			)
				.filter((daily): daily is { activities: Activity; dailies: Daily } => {
					return daily.activities !== null;
				})
				.map((daily) => {
					return { ...daily.activities, activeDays: daily.dailies.activeDays };
				})[0],
			series: [],
			sets: []
		};
		daily.series = await getSeries(db, dailyId);

		clientOfDailyName = (
			await db.select({ name: users.name }).from(users).limit(1).where(eq(users.id, daily.clientId))
		)[0].name;
	}

	let clientNames: { id: string; name: string }[];
	if (locals.userType === userTypes.TRAINER) {
		const db = initDrizzle(platform);
		clientNames = await db
			.select({ id: users.id, name: users.name })
			.from(clients)
			.limit(1)
			.innerJoin(users, eq(clients.id, users.id))
			.where(eq(clients.trainerId, locals.user?.id));
	} else clientNames = [];

	return {
		daily: { ...daily, clientName: clientOfDailyName },
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
			await db
				.insert(dailies)
				.values({ activityId: dbActivity.id, activeDays: form.data.activeDays });
		}
		form.data.series.forEach(async (formSeries, i) => {
			formSeries.index = i;

			let dbSeries: Series;
			if (formSeries.id) {
				dbSeries = (
					await db
						.update(series)
						.set({ ...formSeries, activityId: dbActivity.id })
						.where(eq(series.id, formSeries.id))
						.returning()
				)[0];
			} else {
				dbSeries = (
					await db
						.insert(series)
						.values({ ...formSeries, activityId: dbActivity.id })
						.returning()
				)[0];
			}

			formSeries.sets.forEach(async (formSet, j) => {
				formSet.index = j;
				if (formSet.id) {
					await db
						.update(sets)
						.set({ ...formSet, seriesId: dbSeries.id })
						.where(eq(sets.id, formSet.id));
				} else {
					await db
						.insert(sets)
						.values({ ...formSet, activityId: dbActivity.id, seriesId: dbSeries.id });
				}
			});
		});
	},

	delete: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		const id = form.data.id;
		if (!id) return fail(500, { form });
		if (!form.valid) return fail(400, { form });

		await initDrizzle(event.platform).delete(activities).where(eq(activities.id, id));
	}
};
