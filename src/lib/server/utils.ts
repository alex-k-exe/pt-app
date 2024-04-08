import type { RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { z } from 'zod';

export function initDrizzle(platform: Readonly<App.Platform> | undefined) {
	if (!platform?.env.DB) throw new Error('Database is undefined');
	return drizzle(platform?.env.DB);
}

export function generateSignupToken() {
	const min = 100000;
	const max = 999999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Event = RequestEvent<Params extends Partial<Record<string, string>>, string>;

export async function validateForm<T extends Event>(
	event: T, formSchema: (db: DrizzleD1Database) => Promise<z.ZodObject>
) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(400, { form });
	return form;
}
