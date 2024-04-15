import {
	clients,
	signupTokens,
	trainers,
	users,
	type SignupToken,
	type Trainer,
	type User
} from '$lib/drizzleTables.ts';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq, lte } from 'drizzle-orm';

export async function load({ platform, locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
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
		.filter((trainer): trainer is { users: User; trainers: Trainer } => trainer !== null)
		.map((user) => user.users);
	console.log(foundTrainers);

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
		if (!clientId) return fail(500, { formData: data });

		const db = initDrizzle(platform);
		db.delete(users).where(eq(users.id, clientId));
		await db.delete(clients).where(eq(clients.id, clientId));
	},

	transferClient: async ({ platform, request }) => {
		const data = await request.formData();
		const trainerId = data.get('trainerId')?.toString();
		const clientId = data.get('clientId')?.toString();
		if (!trainerId || !clientId) return fail(500, { formData: data });

		const db = initDrizzle(platform);
		db.update(clients).set({ trainerId: trainerId }).where(eq(clients.id, clientId));
	},

	createToken: async ({ platform, locals }) => {
		if (!locals.user?.id) return fail(400);
		await initDrizzle(platform).insert(signupTokens).values({
			trainerId: locals.user.id
		});
	},

	deleteToken: async ({ platform, request }) => {
		const signupTokenId = (await request.formData()).get('signupTokenId');
		if (!signupTokenId) return fail(500, { message: 'Signup token is undefined' });

		await initDrizzle(platform)
			.delete(signupTokens)
			.where(eq(signupTokens.id, Number(signupTokenId.toString())));
	}
};
