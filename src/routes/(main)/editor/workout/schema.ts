import { z } from 'zod';
import { activitySchema } from '../schema';

export const formSchema = activitySchema.extend({
	date: z.string(),
	startTime: z.string(),
	endTime: z.string()
});
export type FormWorkout = z.infer<typeof formSchema>;
