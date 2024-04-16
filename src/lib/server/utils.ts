import { clients, series, sets, users, type Series, type SeriesInsert } from '$lib/drizzleTables';
import { arrayToTuple } from '$lib/utils/other';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';

export function initDrizzle(platform: Readonly<App.Platform> | undefined) {
	if (!platform?.env.DB) throw new Error('Database is undefined');
	return drizzle(platform?.env.DB);
}

export async function getSeries(db: DrizzleD1Database, activityId: number) {
	const seriesWithSets = (
		await db.select().from(series).orderBy(series.index).where(eq(series.activityId, activityId))
	).map((series) => {
		return { ...series, sets: [] };
	});

	const getSetsInSeries = seriesWithSets.map((singleSeries) => {
		return db.select().from(sets).orderBy(sets.index).where(eq(sets.seriesId, singleSeries.id));
	});
	const setsInSeries = (await db.batch(arrayToTuple(getSetsInSeries))).map((set) => set);
	return seriesWithSets.map((series, i) => {
		return { ...series, sets: setsInSeries[i] };
	});
}

export async function getTrainersClients(db: DrizzleD1Database, trainerId: string) {
	return await db
		.select()
		.from(users)
		.leftJoin(clients, eq(clients.id, users.id))
		.where(eq(clients.trainerId, trainerId));
}

export async function insertOrUpdateSeries(db: DrizzleD1Database, inputSeries: SeriesInsert) {
	let dbSeries: Series;
	if (inputSeries.id) {
		dbSeries = (
			await db
				.update(series)
				.set({ ...inputSeries })
				.where(eq(series.id, inputSeries.id))
				.returning()
		)[0];
	} else {
		dbSeries = (
			await db
				.insert(series)
				.values({ ...inputSeries })
				.returning()
		)[0];
	}
	return dbSeries;
}
