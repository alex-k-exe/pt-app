import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { children } from './schema';
import { ChildInsert } from './types';

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);

		switch (pathname) {
			case '/':
				return new Response('Call /api/children to see the list of children');
			case '/api/children':
				const db = drizzle(env.DB, { schema });
				await db.insert(children).values(await insertChildrenData());
				return await db.query.children.findMany();
			default:
				break;
		}
	},
};

async function insertChildrenData() {
	const response = await fetch('https://advent.sveltesociety.dev/data/2023/day-three.json');
	return (await response.json()) as ChildInsert[];
}
