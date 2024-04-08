import { signupTokens } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { fail, type RequestEvent } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { RouteParams } from './$types';

export async function formSchema(db: DrizzleD1Database) {
	return z.object({
		signupToken: z
			.number()
			.int()
			.min(100000)
			.max(999999)
			.refine(async (tokenId) => {
				// check that signup token exists and isn't expired
				const token = (
					await db.select().from(signupTokens).limit(1).where(eq(signupTokens.id, tokenId))
				)[0];

				return dayjs(token.creationTimeDate).diff(dayjs(), 'hours') < 10;
			})
	});
}

export type FormSchema = typeof formSchema;

export async function validateForm(event: RequestEvent<RouteParams, '/(entry)/login'>) {
	const form = await superValidate(event, zod(await formSchema(initDrizzle(event.platform))));
	if (!form.valid) return fail(400, { form });
	return form;
}
