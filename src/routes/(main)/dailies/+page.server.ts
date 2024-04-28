import { activities, clients, dailies, users, type User } from '$lib/drizzleTables';
import { getTrainersClients } from '$lib/server/dbUtils';
import { userTypes } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform }) {
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');

	const db = locals.db;
	const foundDailies = (
		await db
			.select()
			.from(activities)
			.innerJoin(dailies, eq(activities.id, dailies.id))
			.orderBy(activities.startTime)
			.where(or(eq(activities.clientId, locals.user.id), eq(activities.trainerId, locals.user.id)))
	).map((daily) => {
		return { ...daily.activities, activeDays: daily.dailies.activeDays };
	});

	let clientsInWorkoutsNames: string[] | null = null;
	let trainersClients: User[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		clientsInWorkoutsNames = await Promise.all(
			foundDailies.map(async (workout) => {
				const names = await db
					.select({ clientsName: users.name })
					.from(users)
					.innerJoin(clients, eq(users.id, clients.id))
					.limit(1)
					.where(eq(clients.id, workout.clientId));
				return names.length > 0 ? names[0].clientsName : 'No client found';
			})
		);

		trainersClients = await getTrainersClients(db, locals.user.id);
	}

	return {
		dailies: foundDailies.map((daily, i) => {
			return { ...daily, clientsName: clientsInWorkoutsNames ? clientsInWorkoutsNames[i] : null };
		}),
		clients: trainersClients
	};
}

export const actions = {
	default: async ({ request, platform, locals }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const dailyId = (await request.formData()).get('dailyId')?.toString();
		if (!dailyId) return fail(400);
		await locals.db.delete(dailies).where(eq(dailies.id, Number(dailyId)));
	}
};
