import { activities } from '$lib/drizzleTables.ts';
import { createInsertSchema } from 'drizzle-zod';

export const formSchema = createInsertSchema(activities);
