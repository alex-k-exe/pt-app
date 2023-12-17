import type { App } from '$lib/../app';

export async function fetchChildrenData() {
	const fetchedData = await fetch('https://advent.sveltesociety.dev/data/2023/day-three.json');
	type JSONChild = {
		name: string;
		weight: number;
	};
	const jsonChildren = (await fetchedData.json()) as JSONChild[];

	const formattedChildren: App.ChildInsertSchema[] = new Array<App.ChildInsertSchema>(
		jsonChildren.length
	);
	for (let i = 0; i < jsonChildren.length; i++) {
		formattedChildren[i] = {
			childName: jsonChildren[i].name,
			presentsWeight: jsonChildren[i].weight
		};
	}
	return formattedChildren;
}
