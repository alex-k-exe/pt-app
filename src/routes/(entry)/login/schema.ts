import { validPassword } from '$lib/utils/types/other.ts';
import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email().min(5).max(100),
	password: z.string().regex(validPassword).min(12).max(100),
	targetHref: z.string().max(100).nullish()
});

export type FormSchema = typeof formSchema;
