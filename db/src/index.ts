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
				const fetchedData = await fp.chunk(fetchChildrenData(), 900);
				for (const chunk of fetchedData) {
					await db.insert(schema.children).values(chunk);
				}
				return new Response(db.query.children.findMany(), { status: 200 });
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
