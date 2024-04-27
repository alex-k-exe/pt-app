import { activities, series, sets } from '$lib/drizzleTables';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const setsSchema = createInsertSchema(sets).omit({
	id: true,
	seriesId: true,
	activityId: true
});
export type FormSet = z.infer<typeof setsSchema>;

const seriesSchema = createInsertSchema(series)
	.omit({ id: true, activityId: true })
	.extend({ sets: z.array(setsSchema) });
export type FormSeries = z.infer<typeof seriesSchema>;

export const activitySchema = createInsertSchema(activities).extend({
	series: z.array(seriesSchema),
	sets: z.array(setsSchema),
	clientId: z.string().min(1),
	title: z.string().min(1)
});
export type FormActivity = z.infer<typeof activitySchema>;

export function handleAddSet(sets: FormSet[]) {
	sets.push({ index: sets.length, exerciseName: 'Example' });
	return sets;
}
export function handleDeleteElement<T>(elements: T[], index: number) {
	elements.splice(index);
	return elements;
}
