import { signupTokens } from '$lib/drizzleTables';
import { dayjs } from '$lib/utils/dates';
import { validEmail, validNaturalNumber, validPassword } from '$lib/utils/types';
import { and, eq, gt } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { z } from 'zod';

export const formSchema = z
	.object({
		trainerId: z.string().nullish(),
		email: z.string().regex(validEmail.regex, validEmail.message).min(5).max(100),
		password: z.string().regex(validPassword.regex, validPassword.message).min(12).max(100),
		confirmPassword: z.string().regex(validPassword.regex, validPassword.message).min(12).max(100),
		name: z.string().max(100)
	})
	.refine((data) => data.password === data.confirmPassword);

export const signupTokenSchema = z
	.string()
	.length(
		6,
		'Token must be greater than or equal to 100,000 but also less than or equal to 999,999'
	)
	.refine((token) => validNaturalNumber.test(token), 'Token must be a positive whole number');

export async function asyncTokenSchema(db: DrizzleD1Database) {
	return signupTokenSchema.refine(async (tokenId) => {
		// check that signup token exists and isn't expired
		const token = await db
			.select()
			.from(signupTokens)
			.limit(1)
			.where(
				and(
					eq(signupTokens.id, Number(tokenId)),
					gt(signupTokens.creationTimeDate, dayjs().subtract(24, 'hours').toDate())
				)
			);
		const tokenExpired = token.length !== 1;
		if (tokenExpired) await db.delete(signupTokens).where(eq(signupTokens.id, Number(tokenId)));
		return !tokenExpired;
	}, 'Signup token does not exist or is expired');
}
