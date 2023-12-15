// https://developers.cloudflare.com/d1/examples/d1-and-sveltekit/

import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { ChildSchema } from './types';
var fp = require('lodash/fp');

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);
		switch (pathname) {
			case '/api/children':
				const db = drizzle(env.DB, { schema });

				// fetch the data for the children
				// SQL limits insertions to 999 rows at a time
				for (const chunk of fp.chunk(fetchChildrenData(), 900)) {
					await db.insert(schema.children).values(chunk);
				}
				// await db.insert(schema.children).values(fetchedData.slice(0, 5));
				return new Response(
					JSON.stringify(await db.query.children.findMany(), (_key, value) => (value === this ? undefined : value)),
					{ status: 200 }
				);
			default:
				return new Response('Go to /api/children', { status: 200 });
		}
	},
};

async function fetchChildrenData() {
	const fetchedData = await fetch('https://advent.sveltesociety.dev/data/2023/day-three.json');
	type JSONChild = {
		name: string;
		weight: number;
	};
	const jsonChildren = (await fetchedData.json()) as JSONChild[];

	const formattedChildren: ChildSchema[] = new Array<ChildSchema>(jsonChildren.length);
	for (let i = 0; i < jsonChildren.length; i++) {
		formattedChildren[i] = { childName: jsonChildren[i].name, presentsWeight: jsonChildren[i].weight };
	}
	return formattedChildren;
}
