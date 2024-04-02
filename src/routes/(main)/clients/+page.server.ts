import { clients, trainers, users, type User } from '$lib/drizzleTables.ts';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
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
	delete: async ({ platform, request }) => {
		const data = await request.formData();
		const clientId = data.get('clientId')?.toString();
		if (!clientId) return fail(500, { formData: data });

		const db = initDrizzle(platform);
		db.delete(users).where(eq(users.id, clientId));
		await db.delete(clients).where(eq(clients.id, clientId));
	},

	transfer: async ({ platform, request }) => {
		const data = await request.formData();
		const trainerId = data.get('trainerId')?.toString();
		const clientId = data.get('clientId')?.toString();
		if (!trainerId || !clientId) return fail(500, { formData: data });

		const db = initDrizzle(platform);
		db.update(clients).set({ trainerId: trainerId }).where(eq(clients.id, clientId));
	}

	// TODO: implement invite action
};
