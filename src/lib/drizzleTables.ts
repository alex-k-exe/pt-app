import dayjs from 'dayjs';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Drizzle ensures type safety in the queried data from the DB
// The tables defined here are converted to SQL code by calling pnpm generate
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	name: text('name').notNull()
});
export type User = typeof users.$inferSelect;

export const clients = sqliteTable('clients', {
	id: text('id')
		.references(() => users.id)
		.primaryKey(),
	trainerId: text('trainerId')
		.references(() => trainers.id)
		.notNull()
});
export type Client = typeof clients.$inferSelect;

export const trainers = sqliteTable('trainers', {
	id: text('id')
		.references(() => users.id)
		.primaryKey()
});
export type Trainer = typeof clients.$inferSelect;

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});
export type Session = typeof sessions.$inferSelect;

export const signupTokens = sqliteTable('signupTokens', {
	id: integer('id').primaryKey(),
	trainerId: text('trainerId').references(() => trainers.id),
	creationTimeDate: text('creationTimestamp').notNull().default(dayjs().toISOString())
});
export type SignupToken = typeof signupTokens.$inferSelect;

export const chats = sqliteTable('chats', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId1: text('userId1')
		.notNull()
		.references(() => users.id),
	userId2: text('userId2')
		.notNull()
		.references(() => users.id)
});
export type Chat = typeof chats.$inferSelect;

export const messages = sqliteTable('messages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	chatId: integer('chatId')
		.notNull()
		.references(() => chats.id),
	senderId: text('senderId')
		.notNull()
		.references(() => users.id),
	text: text('text').notNull()
});
export type Message = typeof messages.$inferSelect;

export const activities = sqliteTable('activities', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	clientId: text('clientId')
		.notNull()
		.references(() => clients.id),
	trainerId: text('trainerId')
		.notNull()
		.references(() => trainers.id),
	title: text('name').notNull(),
	notes: text('notes'),
	location: text('location'),
	startTime: text('startTime').notNull(),
	endTime: text('endTime').notNull()
});
export type Activity = typeof activities.$inferSelect;
export type ActivityInsert = typeof activities.$inferInsert;

export const dailies = sqliteTable('dailies', {
	activityId: integer('activityId')
		.references(() => activities.id)
		.primaryKey(),
	// 7 digit binary string indicating which days the daily is on
	activeDays: text('activeDays').notNull()
});
export type Daily = typeof dailies.$inferSelect;

export const workouts = sqliteTable('workouts', {
	activityId: integer('activityId')
		.references(() => activities.id)
		.primaryKey()
		.notNull(),
	date: text('date').notNull()
});
export type Workout = typeof workouts.$inferSelect;

export const series = sqliteTable('series', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	workoutId: integer('workoutId')
		.references(() => activities.id)
		.notNull(),
	index: integer('index').notNull(),
	reps: integer('reps').notNull()
});
export type Series = typeof series.$inferSelect;
export type SeriesInsert = typeof series.$inferInsert;

export const sets = sqliteTable('sets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	workoutId: integer('id')
		.references(() => activities.id)
		.notNull(),
	seriesId: integer('seriesId').notNull(),
	index: integer('integer').notNull(),
	exerciseName: text('name').notNull(),
	reps: text('reps'),
	weight: text('weight'),
	duration: text('duration'),
	rpe: text('rpe')
});
export type Set = typeof sets.$inferSelect;
export type SetInsert = typeof sets.$inferInsert;
