import { activities, clients, dailies, users } from '$lib/drizzleTables';
import { getTrainersClients } from '$lib/server/dbUtils';
import { userTypes } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq, or } from 'drizzle-orm';

export async function load({ locals, url }) {
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');
	const selectedClientId = url.searchParams.get('clientId');

	const foundDailies = (
		await locals.db
			.select()
			.from(activities)
			.innerJoin(dailies, eq(activities.id, dailies.id))
			.orderBy(desc(dailies.activeDays))
			.where(
				and(
					or(eq(activities.clientId, locals.user.id), eq(activities.trainerId, locals.user.id)),
					eq(activities.clientId, selectedClientId ?? activities.clientId)
				)
			)
	).map((daily) => {
		return { ...daily.activities, activeDays: daily.dailies.activeDays };
	});

	let clientsInWorkoutsNames: string[] | null = null;
	let trainersClients: { id: string; name: string }[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		clientsInWorkoutsNames = await Promise.all(
			foundDailies.map(async (workout) => {
				const names = await locals.db
					.select({ clientsName: users.name })
					.from(users)
					.innerJoin(clients, eq(users.id, clients.id))
					.limit(1)
					.where(eq(clients.id, workout.clientId));
				return names.length > 0 ? names[0].clientsName : 'No client found';
			})
		);

		trainersClients = await getTrainersClients(locals.db, locals.user.id);
	}

	return {
		dailies: foundDailies.map((daily, i) => {
			return { ...daily, clientsName: clientsInWorkoutsNames ? clientsInWorkoutsNames[i] : null };
		}),
		clients: trainersClients,
		selectedClientId
	};
}

export const actions = {
	default: async ({ request, locals }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const dailyId = (await request.formData()).get('dailyId')?.toString();
		if (!dailyId) return fail(400);
		await locals.db.delete(dailies).where(eq(dailies.id, Number(dailyId)));
	}
};
