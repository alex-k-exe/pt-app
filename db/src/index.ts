import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { ChildSchema } from './types';

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);
		switch (pathname) {
			case '/api/children':
				const db = drizzle(env.DB, { schema });
				await db.insert(schema.children).values(await fetchChildrenData());
				return await db.query.children.findMany();
			default:
				return 'Go to /api/children';
		}
	},
};

async function fetchChildrenData() {
	const fetchedData = await fetch('https://advent.sveltesociety.dev/data/2023/day-three.json');
	const json = fetchedData.json;

	type JSONChild = {
		name: string;
		weight: number;
	};

	const jsonChildren: JSONChild[] = JSON.parse(json.toString());
	const formattedChildren: ChildSchema[] = new Array<ChildSchema>(jsonChildren.length);
	for (let i = 0; i < jsonChildren.length; i++) {
		formattedChildren[i] = { childName: jsonChildren[i].name, presentsWeight: jsonChildren[i].weight };
	}
	return formattedChildren;
}
