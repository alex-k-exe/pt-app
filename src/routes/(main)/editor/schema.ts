import { activities, series, sets } from '$lib/drizzleTables';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const setsSchema = createInsertSchema(sets).omit({
	activityId: true,
	seriesId: true
});
export type FormSet = z.infer<typeof setsSchema>;

const seriesSchema = createInsertSchema(series)
	.omit({ activityId: true })
	.extend({ sets: z.array(setsSchema) });
export type FormSeries = z.infer<typeof seriesSchema>;

export const activitySchema = createInsertSchema(activities).extend({
	series: z.array(seriesSchema),
	sets: z.array(setsSchema)
});
export type FormActivity = z.infer<typeof activitySchema>;

export function handleAddSet(sets: FormSet[]) {
	sets.push({ index: sets.length, exerciseName: 'Get it king' });
	return sets;
}
export function handleDeleteElement<T>(elements: T[], index: number) {
	elements.splice(index);
	return elements;
}
