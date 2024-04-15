import { users } from '$lib/drizzleTables';
import { validPassword } from '$lib/utils/types/other.ts';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Scrypt } from 'lucia';
import { z } from 'zod';

export async function formSchema(db: DrizzleD1Database) {
	return z
		.object({
			email: z.string().email().min(5).max(100),
			password: z.string().regex(validPassword.regex, validPassword.message).min(12).max(100),
			targetPath: z.string().max(100).nullish()
		})
		.refine(async (data) => {
			const existingUser = await db
				.select()
				.from(users)
				.limit(1)
				.where(eq(users.email, data.email));
			if (existingUser.length === 0) return false;
			return await new Scrypt().verify(existingUser[0].password, data.password);
		}, 'Email or password is incorrect');
}
