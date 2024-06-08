import { users } from '$lib/drizzleTables';
import { validEmail, validPassword } from '$lib/utils/types';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Scrypt } from 'lucia';
import { z } from 'zod';

export const nameSchema = z.object({
	newName: z.string().min(1).max(100)
});

export async function emailSchema(db: DrizzleD1Database) {
	return z.object({
		newEmail: z
			.string()
			.regex(validEmail.regex, validEmail.message)
			.refine(async (email) => {
				const emails = await db
					.select({ email: users.email })
					.from(users)
					.where(eq(users.email, email));
				return emails.length === 0;
			}, 'Email has already been used')
	});
}

export async function passwordSchema(db: DrizzleD1Database, userId: string) {
	return z.object({
		oldPassword: z
			.string()
			.regex(validPassword.regex, validPassword.message)
			.refine(async (password) => {
				const actualPassword = (
					await db
						.select({ password: users.password })
						.from(users)
						.limit(1)
						.where(eq(users.id, userId))
				)[0].password;
				return await new Scrypt().verify(actualPassword, password);
			}, 'Old password is incorrect'),
		newPassword: z.string().regex(validPassword.regex, validPassword.message)
	});
}
