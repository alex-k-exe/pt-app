import { users } from '$lib/drizzleTables';
import { validPassword } from '$lib/utils/types/other.ts';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { z } from 'zod';

export async function formSchema(db: DrizzleD1Database) {
	return z.object({
		signupTokenId: z.number(),
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
