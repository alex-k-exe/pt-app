import { activities, dailies, series, sets, users, type Activity } from '$lib/drizzleTables';
import { getSeries, getTrainersClients } from '$lib/server/utils';
import { userTypes } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, isNull } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { FormActivity } from '../schema';
import { formSchema } from './schema';

// If given, use the dailyId to get daily (i.e. Activity) along with its Series and Sets
// If User is a Trainer, find the names of their clients and attach the name of the client to the daily
// Otherwise make a new daily
export async function load({ url, locals, platform }) {
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');

	let daily: FormActivity & { activeDays: string } = {
		activeDays: '0000000',
		clientId: '',
		trainerId: locals.user.id, // only trainers can make a new daily
		title: '',
		startTime: new Date(),
		endTime: new Date(),
		series: [],
		sets: []
	};

	const db = locals.db;
	const dailyId = url.searchParams.get('dailyId');
	let clientOfDailyName: string = '';
	if (dailyId) {
		daily = {
			...(
				await db
					.select()
					.from(activities)
					.innerJoin(dailies, eq(activities.id, dailies.id))
					.limit(1)
					.where(eq(dailies.id, Number(dailyId)))
			).map((daily) => {
				return { ...daily.activities, activeDays: daily.dailies.activeDays };
			})[0],
			series: [],
			sets: []
		};
		daily.series = await getSeries(db, Number(dailyId));
		daily.sets = await db
			.select()
			.from(sets)
			.orderBy(sets.index)
			.where(and(eq(sets.id, Number(dailyId)), isNull(sets.seriesId)));

		clientOfDailyName = (
			await db.select({ name: users.name }).from(users).limit(1).where(eq(users.id, daily.clientId))
		)[0].name;
	}

	const duplicateString = url.searchParams.get('duplicate');
	if (duplicateString && duplicateString !== 'false' && duplicateString !== '0') {
		daily.id = undefined;
	}

	let trainersClients: { id: string; name: string }[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		trainersClients = await getTrainersClients(db, locals.user.id);
		if (trainersClients.length === 0) {
			return redirect(
				302,
				'/clients?error=You must have atleast one client to create a workout or daily'
			);
		}
	}

	return {
		daily: { ...daily, clientName: clientOfDailyName },
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
				db.update(dailies).set(form.data).where(eq(dailies.id, form.data.id)),
				db.delete(series).where(eq(series.id, dbActivity.id)),
				db.delete(sets).where(eq(sets.id, dbActivity.id))
			]);
		} else {
			dbActivity = (await db.insert(activities).values(form.data).returning())[0];
			await db.insert(dailies).values({ id: dbActivity.id, activeDays: form.data.activeDays });
		}
		form.data.series.forEach(async (formSeries) => {
			const dbSeries = (
				await db
					.insert(series)
					.values({ ...formSeries, activityId: dbActivity.id })
					.returning()
			)[0];
			formSeries.sets.map(async (formSet) => {
				await db
					.insert(sets)
					.values({ ...formSet, seriesId: dbSeries.id, activityId: dbActivity.id });
			});
		});
		form.data.sets.forEach(async (formSet) => {
			await db.insert(sets).values({ ...formSet, activityId: dbActivity.id });
		});
		return redirect(302, '/dailies');
	},

	delete: async ({ request, platform, locals }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const id = (await request.formData()).get('id');
		if (!id) return fail(500);

		await locals.db.delete(activities).where(eq(activities.id, Number(id.toString())));
	}
};
