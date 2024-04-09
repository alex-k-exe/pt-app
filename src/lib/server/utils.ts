import { fail, type RequestEvent } from '@sveltejs/kit';
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z, type ZodRawShape } from 'zod';

export function initDrizzle(platform: Readonly<App.Platform> | undefined) {
	if (!platform?.env.DB) throw new Error('Database is undefined');
	return drizzle(platform?.env.DB);
}

export function generateSignupToken() {
	const min = 100000;
	const max = 999999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function validateForm<T extends ZodRawShape>(
	event: RequestEvent<Partial<Record<string, string>>>,
	formSchema: z.ZodObject<T> | ((db: DrizzleD1Database) => Promise<z.ZodObject<T>>)
) {
	let form;
	if (formSchema instanceof z.ZodObject) form = await superValidate(event, zod(formSchema));
	else form = await superValidate(event, zod(await formSchema(initDrizzle(event.platform))));
	if (!form.valid) return fail(400, { form });
	return form;
}
