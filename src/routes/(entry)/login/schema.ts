import { validPassword } from '$lib/utils/types/other.ts';
import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email().min(5).max(100),
	password: z.string().regex(validPassword.regex, validPassword.message).min(12).max(100),
	targetPath: z.string().max(100).nullish()
});
