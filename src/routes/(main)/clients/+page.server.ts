import {
	clients,
	signupTokens,
	trainers,
	users,
	type SignupToken,
	type User
} from '$lib/drizzleTables.ts';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq, lte, ne } from 'drizzle-orm';

export async function load({ platform, locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const db = initDrizzle(platform);

	const foundClients = (
		await db
			.select()
			.from(users)
			.leftJoin(clients, eq(clients.id, users.id))
			.orderBy(users.name)
			.where(eq(clients.trainerId, locals.user?.id))
	).map((client) => client.users);

	const foundTrainers: User[] = (
		await db
			.select()
			.from(users)
			.leftJoin(trainers, eq(trainers.id, users.id))
			.orderBy(users.name)
			.where(ne(users.id, locals.user.id))
	).map((user) => user.users);

	await db
		.delete(signupTokens)
		.where(lte(signupTokens.creationTimeDate, dayjs().subtract(10, 'hour').toDate()));
	const foundTokens: SignupToken[] = await db
		.select()
		.from(signupTokens)
		.orderBy(signupTokens.creationTimeDate)
		.where(eq(signupTokens.trainerId, locals.user.id));

	return { clients: foundClients, trainers: foundTrainers, signupTokens: foundTokens };
}

export const actions = {
	deleteClient: async ({ platform, request }) => {
		const data = await request.formData();
		const clientId = data.get('clientId')?.toString();
		if (!clientId) return fail(400);

		const db = initDrizzle(platform);
		db.delete(users).where(eq(users.id, clientId));
	},

	transferClient: async ({ platform, request }) => {
		const data = await request.formData();
		const trainerId = data.get('newTrainerId');
		const clientId = data.get('clientId');
		if (!trainerId || !clientId) return fail(400);

		await initDrizzle(platform)
			.update(clients)
			.set({ trainerId: trainerId.toString() })
			.where(eq(clients.id, clientId.toString()));
	},

	createToken: async ({ platform, locals }) => {
		if (!locals.user?.id) return fail(400);
		await initDrizzle(platform).insert(signupTokens).values({
			trainerId: locals.user.id
		});
		return redirect(302, '/clients');
	},

	deleteToken: async ({ platform, request }) => {
		const signupTokenId = (await request.formData()).get('signupTokenId');
		if (!signupTokenId) return fail(500, { message: 'Signup token is undefined' });

		await initDrizzle(platform)
			.delete(signupTokens)
			.where(eq(signupTokens.id, Number(signupTokenId.toString())));
	}
};
