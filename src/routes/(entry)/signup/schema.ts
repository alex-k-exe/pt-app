import { signupTokens, users } from '$lib/drizzleTables';
import { validPassword } from '$lib/utils/types/other.ts';
import dayjs from 'dayjs';
import { and, eq, gt } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { z } from 'zod';

export async function formSchema(db: DrizzleD1Database) {
	return z
		.object({
			targetPath: z.string().nullish(),
			trainerId: z.string().nullish(),
			email: z
				.string()
				.email()
				.min(5)
				.max(100)
				.refine(
					async (email) => {
						const emails = await db
							.select({ email: users.email })
							.from(users)
							.limit(1)
							.where(eq(users.email, email));
						return emails.length === 0;
					},
					{ message: 'Email is already in use', path: ['email'] }
				),
			password: z.string().regex(validPassword.regex, validPassword.message).min(12).max(100),
			confirmPassword: z
				.string()
				.regex(validPassword.regex, validPassword.message)
				.min(12)
				.max(100),
			name: z.string().max(100)
		})
		.refine((data) => data.password === data.confirmPassword);
}
export type FormSchema = z.infer<Awaited<ReturnType<typeof formSchema>>>;

export const signupTokenSchema = z.number().int().min(100000).max(999999);
export async function asyncTokenSchema(db: DrizzleD1Database) {
	return signupTokenSchema.refine(async (tokenId) => {
		// check that signup token exists and isn't expired
		const token = await db
			.select()
			.from(signupTokens)
			.limit(1)
			.where(
				and(
					eq(signupTokens.id, tokenId),
					gt(signupTokens.creationTimeDate, dayjs().subtract(24, 'hours').toDate())
				)
			);
		const tokenExpired = token.length !== 1;
		if (tokenExpired) await db.delete(signupTokens).where(eq(signupTokens.id, tokenId));
		return !tokenExpired;
	}, 'Signup token does not exist or is expired');
}
