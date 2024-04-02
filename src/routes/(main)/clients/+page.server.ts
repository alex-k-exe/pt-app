import { clients, trainers, users, type User } from '$lib/drizzleTables.ts';
import { initDrizzle } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ platform, locals }) {
	if (!locals.user?.id) throw redirect(302, '/login');
	const db = initDrizzle(platform);

	const foundClients: User[] = (
		await db
			.select()
			.from(clients)
			.leftJoin(users, eq(users.id, clients.id))
			.orderBy(users.name)
			.where(eq(clients.trainerId, locals.user?.id))
	)
		.map((user) => user.users)
		.filter((client): client is User => client !== null);

	const foundTrainers: User[] = (
		await db.select().from(trainers).leftJoin(users, eq(users.id, trainers.id)).orderBy(users.name)
	)
		.map((user) => user.users)
		.filter((trainer): trainer is User => trainer !== null);

	return { clients: foundClients, trainers: foundTrainers };
}

export const actions = {
	// Delete Transfer Invite
	delete: async ({ platform }) => {
		await initDrizzle(platform).delete(users);
	}
};
