import { activities } from '$lib/drizzleTables';
import { createInsertSchema } from 'drizzle-zod';

export const formSchema = createInsertSchema(activities, {});

export type FormSchema = typeof formSchema;
