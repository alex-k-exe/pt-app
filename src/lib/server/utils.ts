import { clients, series, sets, users } from '$lib/drizzleTables';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export async function getSeries(db: DrizzleD1Database, id: number) {
	const seriesWithSets = (
		await db.select().from(series).orderBy(series.index).where(eq(series.id, id))
	).map((series) => {
		return { ...series, sets: [] };
	});

	const setsInSeries = await Promise.all(
		seriesWithSets.map(async (singleSeries) => {
			return await db
				.select()
				.from(sets)
				.orderBy(sets.index)
				.where(eq(sets.seriesId, singleSeries.id));
		})
	);
	return seriesWithSets.map((series, i) => {
		return { ...series, sets: setsInSeries[i] };
	});
}

export async function getTrainersClients(db: DrizzleD1Database, trainerId: string) {
	return (
		await db
			.select()
			.from(users)
			.innerJoin(clients, eq(clients.id, users.id))
			.where(eq(clients.trainerId, trainerId))
	).map((user) => user.users);
}
