import {
	clients,
	signupTokens,
	trainers,
	users,
	type SignupToken,
	type User
} from '$lib/drizzleTables.ts';
import { dayjs } from '$lib/utils/dates';
import { fail, redirect } from '@sveltejs/kit';
import { eq, lte, ne } from 'drizzle-orm';

export async function load({ locals }) {
	if (!locals.user?.id) return redirect(302, '/login');
	const db = locals.db;

	const foundClients = (
		await db
			.select()
			.from(users)
			.innerJoin(clients, eq(clients.id, users.id))
			.orderBy(users.name)
			.where(eq(clients.trainerId, locals.user?.id))
	).map((client) => client.users);

	const foundTrainers: User[] = (
		await db
			.select()
			.from(users)
			.innerJoin(trainers, eq(trainers.id, users.id))
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
	deleteClient: async ({ locals, request }) => {
		const data = await request.formData();
		const clientId = data.get('clientId')?.toString();
		if (!clientId) return fail(400);

		const db = locals.db;
		db.delete(users).where(eq(users.id, clientId));
	},

	transferClient: async ({ locals, request }) => {
		const data = await request.formData();
		const trainerId = data.get('newTrainerId');
		const clientId = data.get('clientId');
		if (!trainerId || !clientId) return fail(400);

		await locals.db
			.update(clients)
			.set({ trainerId: trainerId.toString() })
			.where(eq(clients.id, clientId.toString()));
	},

	createToken: async ({ locals }) => {
		if (!locals.user?.id) return fail(400);
		await locals.db.insert(signupTokens).values({
			trainerId: locals.user.id
		});
		return redirect(302, '/clients');
	},

	deleteToken: async ({ locals, request }) => {
		const signupTokenId = (await request.formData()).get('signupTokenId');
		if (!signupTokenId) return fail(500, { message: 'Signup token is undefined' });

		await locals.db
			.delete(signupTokens)
			.where(eq(signupTokens.id, Number(signupTokenId.toString())));
	}
};
