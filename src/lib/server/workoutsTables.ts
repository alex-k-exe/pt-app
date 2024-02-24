import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { clients, trainers } from './usersTables';

export const workouts = sqliteTable('workouts', {
	id: text('id').primaryKey(),
	clientId: text('clientId')
		.notNull()
		.references(() => clients.id),
	trainerId: text('trainerId')
		.notNull()
		.references(() => trainers.id),
	title: text('name'),
	notes: text('notes'),
	startTimeDate: text('startTimeDate').notNull(),
	endTimeDate: text('endTimeDate').notNull(),
	recurringDays: text('recurringDays'),
	location: text('location'),
	remindMinsClient: integer('remindMinsClient'),
	remindMinsTrainer: integer('remindMinsTrainer')
});
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

export const series = sqliteTable('series', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	workoutId: text('workoutId')
		.references(() => workouts.id)
		.notNull(),
	reps: integer('reps').notNull()
});
export type Series = typeof series.$inferSelect;
export type InsertSeries = typeof series.$inferInsert;

export const sets = sqliteTable('sets', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	workoutId: text('id')
		.references(() => workouts.id)
		.notNull(),
	seriesId: integer('seriesId').notNull(),
	exerciseName: text('exerciseName').notNull(),
	reps: text('reps'),
	weight: text('weight'),
	duration: text('duration'),
	rpe: text('rpe')
});
export type Set = typeof series.$inferSelect;
export type InsertSet = typeof series.$inferInsert;
