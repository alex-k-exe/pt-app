import { activities, series, sets } from '$lib/drizzleTables';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const setsSchema = createInsertSchema(sets).omit({
	activityId: true,
	seriesId: true
});

const seriesSchema = createInsertSchema(series)
	.omit({ activityId: true })
	.extend({ sets: z.array(setsSchema) });

export const activitySchema = createInsertSchema(activities).extend({
	series: z.array(seriesSchema),
	sets: z.array(setsSchema)
});
