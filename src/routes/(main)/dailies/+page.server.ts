import { activities, clients, dailies, users, type Activity, type Daily } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { UserType } from '$lib/utils/types/other';
import { redirect } from '@sveltejs/kit';
import { eq, or, sql } from 'drizzle-orm';

export async function load({ locals, platform }) {
	if (!locals.user?.id) throw redirect(302, '/login?targetHref=/dailies');
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

	let otherPersonsNames: string[];
	console.log('here it comes!');
	if (locals.userType === UserType.CLIENT) {
		const getOtherPersonsName = db
			.select({ otherPersonsName: users.name })
			.from(users)
			.limit(1)
			.leftJoin(clients, eq(users.id, clients.id))
			.where(eq(clients.id, sql.placeholder('clientId')));

		const thing = await db.batch([getOtherPersonsName]);
	}

	return {
		dailies: foundDailies.map((daily, i) => {
			return { ...daily, otherPersonsName: otherPersonsNames[i] };
		}),
		userType: locals.userType
	};
}
