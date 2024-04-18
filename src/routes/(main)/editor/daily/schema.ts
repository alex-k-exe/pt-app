import { z } from 'zod';
import { activitySchema } from '../schema';

export const formSchema = activitySchema.extend({
	activeDays: z.string(),
	title: z.string().min(1)
});
export type FormSchema = z.infer<typeof formSchema>;
