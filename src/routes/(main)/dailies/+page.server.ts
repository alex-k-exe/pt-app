import { activities, clients, dailies, users } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { userTypes } from '$lib/utils/types/other.js';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform }) {
	if (!locals.user?.id || !locals.userType) return redirect(302, '/login');
	const db = initDrizzle(platform);

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

	let clientsNames: string[] | null = null;
	if (locals.userType === userTypes.TRAINER) {
		clientsNames = await Promise.all(
			foundDailies.map(async (daily) => {
				const names = await db
					.select({ clientsName: users.name })
					.from(users)
					.innerJoin(clients, eq(users.id, clients.id))
					.limit(1)
					.where(eq(clients.id, daily.clientId));
				return names.length > 0 ? names[0].clientsName : 'No client found';
			})
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
			.where(eq(dailies.id, Number(dailyId)));
	}
};
