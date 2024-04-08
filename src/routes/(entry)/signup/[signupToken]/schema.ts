import { users } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { validPassword } from '$lib/utils/types/other.ts';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { RouteParams } from './$types';

export async function formSchema(db: DrizzleD1Database) {
	return z.object({
		trainerId: z.string().optional(),
		email: z
			.string()
			.email()
			.min(5)
			.max(100)
			.refine(
				async (email) => {
					// check if email hasn't already been used
					const emails = await db
						.select({ email: users.email })
						.from(users)
						.limit(1)
						.where(eq(users.email, email));
					return emails.length === 0;
				},
				{ message: 'Email is already in use', path: ['email'] }
			),
		password: z
			.object({
				password: z.string().regex(validPassword).min(12).max(100),
				confirmPassword: z.string().regex(validPassword).min(12).max(100)
			})
			.refine((data) => data.password === data.confirmPassword),
		name: z.string().max(100)
	});
}

export type FormSchema = typeof formSchema;

export async function validateForm(
	event: RequestEvent<RouteParams, '/(entry)/signup/[signupToken]'>
) {
	const form = await superValidate(event, zod(await formSchema(initDrizzle(event.platform))));
	if (!form.valid) return fail(400, { form });
	return form;
}
