import { initDrizzle } from '$lib/server/utils';

export async function load({ locals, platform }) {
	const db = initDrizzle(platform);
}
