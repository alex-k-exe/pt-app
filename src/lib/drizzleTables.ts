import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Drizzle ensures type safety in the queried data from the DB
// The tables defined here are converted to SQL code by drizzle-kit in the CLI
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	refreshToken: text('refreshToken').unique()
});
export type User = typeof users.$inferSelect;

export const sessions = sqliteTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});
export type Session = typeof sessions.$inferSelect;

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

export const chats = sqliteTable('chats', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId1: text('userId1')
		.notNull()
		.references(() => users.id),
	userId2: text('userId2')
		.notNull()
		.references(() => users.id)
});
export type Chat = typeof chats.$inferSelect;

export const messages = sqliteTable('messages', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	chatId: integer('chatId')
		.notNull()
		.references(() => chats.id),
	senderId: text('senderId')
		.notNull()
		.references(() => users.id),
	text: text('text').notNull()
});
export type Message = typeof messages.$inferSelect;

export const signupTokens = sqliteTable('signupTokens', {
	id: text('id').primaryKey(),
	trainerId: text('trainerId').references(() => trainers.id),
	creationTimestamp: text('creationTimestamp').notNull()
});
export type SignupToken = typeof messages.$inferSelect;

export const activities = sqliteTable('activities', {
	id: integer('id').primaryKey(),
	clientId: text('clientId')
		.notNull()
		.references(() => clients.id),
	trainerId: text('trainerId')
		.notNull()
		.references(() => trainers.id),
	title: text('name'),
	notes: text('notes'),
	location: text('location'),
	startTimeDate: text('startTimeDate').notNull(),
	endTimeDate: text('endTimeDate').notNull()
});
export type Activity = typeof activities.$inferSelect;

export const dailies = sqliteTable('dailies', {
	activityId: integer('activityId')
		.references(() => activities.id)
		.primaryKey(),
	// 7 digit binary string indicating which days the daily is on
	recurringDays: text('recurringDays').notNull()
});
export type Daily = typeof dailies.$inferSelect;

export const workouts = sqliteTable('workouts', {
	activityId: integer('activityId')
		.references(() => activities.id)
		.primaryKey()
});
export type Workout = typeof activities.$inferSelect;

export const series = sqliteTable('series', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	workoutId: text('workoutId')
		.references(() => activities.id)
		.notNull(),
	reps: integer('reps').notNull()
});
export type Series = typeof series.$inferSelect;

export const sets = sqliteTable('sets', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	workoutId: text('id')
		.references(() => activities.id)
		.notNull(),
	seriesId: integer('seriesId').notNull(),
	name: text('name').notNull(),
	reps: text('reps'),
	weight: text('weight'),
	duration: text('duration'),
	rpe: text('rpe')
});
export type Set = typeof sets.$inferSelect;
