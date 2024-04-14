import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateId } from 'lucia';
import { generateSignupToken } from './utils/other';

// Drizzle ensures type safety in the queried data from the DB
// The tables defined here are converted to SQL code by calling pnpm generate
export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	name: text('name').notNull()
});
export type User = typeof users.$inferSelect;

export const clients = sqliteTable('clients', {
	id: text('id')
		.references(() => users.id, { onDelete: 'cascade' })
		.primaryKey(),
	trainerId: text('trainerId')
		.references(() => trainers.id)
		.notNull()
});
export type Client = typeof clients.$inferSelect;

export const trainers = sqliteTable('trainers', {
	id: text('id')
		.references(() => users.id, { onDelete: 'cascade' })
		.primaryKey()
});
export type Trainer = typeof clients.$inferSelect;

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull()
});
export type Session = typeof sessions.$inferSelect;

export const signupTokens = sqliteTable('signupTokens', {
	id: integer('id')
		.primaryKey()
		.$defaultFn(() => generateSignupToken()),
	trainerId: text('trainerId').references(() => trainers.id, { onDelete: 'cascade' }),
	creationTimeDate: integer('creationTimestamp', { mode: 'timestamp' })
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});
export type SignupToken = typeof signupTokens.$inferSelect;

export const chats = sqliteTable('chats', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId1: text('userId1')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	userId2: text('userId2')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});
export type Chat = typeof chats.$inferSelect;

export const messages = sqliteTable('messages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	sentTimestamp: text('sentTimestamp').default(sql`(CURRENT_TIMESTAMP)`),
	chatId: integer('chatId')
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }),
	senderId: text('senderId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	readByReciever: integer('readByReciever', { mode: 'boolean' }).notNull().default(false)
});
export type Message = typeof messages.$inferSelect;

export const activities = sqliteTable('activities', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	clientId: text('clientId')
		.notNull()
		.references(() => clients.id, { onDelete: 'cascade' }),
	trainerId: text('trainerId')
		.notNull()
		.references(() => trainers.id, { onDelete: 'cascade' }),
	title: text('name').notNull(),
	notes: text('notes'),
	location: text('location'),
	startTime: integer('startTime', { mode: 'timestamp' }).notNull(),
	endTime: integer('endTime', { mode: 'timestamp' }).notNull()
});
export type Activity = typeof activities.$inferSelect;
export type ActivityInsert = typeof activities.$inferInsert;

export const dailies = sqliteTable('dailies', {
	activityId: integer('activityId')
		.references(() => activities.id, { onDelete: 'cascade' })
		.primaryKey(),
	// 7 digit binary string indicating which days the daily is on
	activeDays: text('activeDays').notNull()
});
export type Daily = typeof dailies.$inferSelect;
export type DailyInsert = typeof dailies.$inferInsert;

export const workouts = sqliteTable('workouts', {
	activityId: integer('activityId')
		.references(() => activities.id, { onDelete: 'cascade' })
		.primaryKey()
		.notNull(),
	date: integer('date', { mode: 'timestamp' }).notNull()
});
export type Workout = typeof workouts.$inferSelect;
export type WorkoutInsert = typeof workouts.$inferInsert;

export const series = sqliteTable('series', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	activityId: integer('activityId')
		.references(() => activities.id, { onDelete: 'cascade' })
		.notNull(),
	index: integer('index').notNull(),
	reps: integer('reps').notNull()
});
export type Series = typeof series.$inferSelect;
export type SeriesInsert = typeof series.$inferInsert;

export const sets = sqliteTable('sets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	activityId: integer('activityId')
		.references(() => activities.id, { onDelete: 'cascade' })
		.notNull(),
	seriesId: integer('seriesId').notNull(),
	index: integer('index').notNull(),
	exerciseName: text('exerciseName').notNull(),
	reps: text('reps'),
	weight: text('weight'),
	duration: text('duration'),
	rpe: text('rpe')
});
export type SetInsert = typeof sets.$inferInsert;
