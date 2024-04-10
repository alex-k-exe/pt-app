import { activities, series, sets } from '$lib/drizzleTables';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const setsSchema = createInsertSchema(sets).omit({ seriesId: true, workoutId: true });
export type SimplifiedSet = typeof setsSchema;

const seriesSchema = createInsertSchema(series).extend({ sets: z.array(setsSchema) });
export type SeriesWithSets = typeof seriesSchema;

export const formSchema = createInsertSchema(activities).extend({
	series: z.array(seriesSchema),
	sets: z.array(setsSchema),
	date: z.string()
});
export type WorkoutWithSeries = typeof formSchema;
