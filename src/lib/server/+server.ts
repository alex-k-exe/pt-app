import { dev } from '$app/environment';
import { Miniflare } from 'miniflare';

export async function getDB(platform: Readonly<App.Platform>) {
	if (dev) {
		return new Miniflare({
			d1Databases: ['DB']
		});
	}
}
