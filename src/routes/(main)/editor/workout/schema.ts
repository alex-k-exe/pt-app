import { z } from 'zod';
import { activitySchema } from '../schema';

export const formSchema = activitySchema.extend({ date: z.date() });