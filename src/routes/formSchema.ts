import { z } from 'zod';

export const formSchema = z.object({
	username: z
		.string()
		.min(2)
		.max(50)
		.regex(/^[a-zA-Z0-9_-]+$/),
	password: z.string().min(2).max(200)
});

export type FormSchema = typeof formSchema;
