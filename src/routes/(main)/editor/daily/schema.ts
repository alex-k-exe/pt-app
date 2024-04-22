import { z } from 'zod';
import { activitySchema } from '../schema';

export const formSchema = activitySchema.extend({
	activeDays: z.string()
});
export type FormSchema = z.infer<typeof formSchema>;
