import { signupTokens } from '$lib/drizzleTables';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { z } from 'zod';

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
