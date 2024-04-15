import { activities, clients, dailies, users, type Activity, type Daily } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { arrayToTuple } from '$lib/utils/other.js';
import { userTypes } from '$lib/utils/types/other.js';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform }) {
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');
	const db = initDrizzle(platform);

	const foundDailies = (
		await db
			.select()
			.from(dailies)
			.leftJoin(activities, eq(activities.id, dailies.activityId))
			.orderBy(activities.startTime)
			.where(
				or(eq(activities.clientId, locals.user?.id), eq(activities.trainerId, locals.user?.id))
			)
	)
		.filter((daily): daily is { activities: Activity; dailies: Daily } => daily !== null)
		.map((daily) => {
			return { ...daily.activities, activeDays: daily.dailies.activeDays };
		});

	let clientsNames: string[] | null = null;
	if (locals.userType === userTypes.CLIENT) {
		const getOtherPersonsNames = foundDailies.map((daily) =>
			db
				.select({ otherPersonsName: users.name })
				.from(users)
				.leftJoin(clients, eq(users.id, clients.id))
				.limit(1)
				.where(eq(clients.id, daily.clientId))
		);

		clientsNames = (await db.batch(arrayToTuple(getOtherPersonsNames))).map(
			(name) => name[0].otherPersonsName
		);
	}

	return {
		dailies: foundDailies.map((daily, i) => {
			return { ...daily, clientsName: clientsNames ? clientsNames[i] : null };
		}),
		userType: locals.userType
	};
}

export const actions = {
	default: async ({ request, platform, locals }) => {
		if (locals.userType !== userTypes.TRAINER) return fail(403);
		const dailyId = (await request.formData()).get('dailyId')?.toString();
		if (!dailyId) return fail(400);
		await initDrizzle(platform)
			.delete(dailies)
			.where(eq(dailies.activityId, Number(dailyId)));
	}
};
