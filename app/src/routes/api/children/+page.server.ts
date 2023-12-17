import { fetchChildrenData } from '$lib/server/db/+server';
import { children } from '$lib/server/db/schema';
import { chunkArray } from '$lib/utils/utils';

export async function load({ platform }) {
	// SQL limits insertions to 999 rows at a time
	for (const chunky of chunkArray(await fetchChildrenData(), 900)) {
		await platform.env.db.insert(children).values(chunky);
	}
	return new Response(
		JSON.stringify(await db.query.children.findMany(), (_key, value) =>
			value === this ? undefined : value
		),
		{ status: 200 }
	);
}
