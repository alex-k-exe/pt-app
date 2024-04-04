import { activities, dailies, type Activity, type Daily } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';

export async function load({ locals, platform }) {
	if (!locals.user?.id) throw redirect(302, '/login?targetHref="/dailies"');
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
	const dailiesWithPersonsName = foundDailies.map((daily) => await db.select());

	return { dailies: foundDailies };
}
