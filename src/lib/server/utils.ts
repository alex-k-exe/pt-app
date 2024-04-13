import { clients, users } from '$lib/drizzleTables';
import { eq } from 'drizzle-orm';
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

export function initDrizzle(platform: Readonly<App.Platform> | undefined) {
	if (!platform?.env.DB) throw new Error('Database is undefined');
	return drizzle(platform?.env.DB);
}

export async function getTrainersClients(db: DrizzleD1Database, trainerId: string) {
	return await db
		.select()
		.from(users)
		.leftJoin(clients, eq(clients.id, users.id))
		.orderBy(users.name)
		.where(eq(clients.trainerId, trainerId));
}
