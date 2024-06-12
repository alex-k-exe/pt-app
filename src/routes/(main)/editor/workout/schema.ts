import { validDate } from '$lib/utils/types';
import { z } from 'zod';
import { activitySchema } from '../schema';

export const formSchema = activitySchema.extend({
	date: z.string().regex(validDate.regex),
	startTime: z.string().regex(validDate.regex),
	endTime: z.string().regex(validDate.regex)
});
export type WorkoutSchema = z.infer<typeof formSchema>;
