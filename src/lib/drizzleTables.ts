import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Drizzle ensures type safety in the queried data from the DB
// The 9 tables defined with sqliteTable() are converted to SQL code by drizzle-kit in the CLI
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull()
});
export type User = typeof users.$inferSelect;

export const sessions = sqliteTable('session', {
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
	startTimeDate: text('startTimeDate'),
	endTimeDate: text('endTimeDate'),
	recurringDays: text('recurringDays'),
	location: text('location'),
	remindMinsClient: integer('remindMinsClient'),
	remindMinsTrainer: integer('remindMinsTrainer')
});
export type Workout = typeof workouts.$inferSelect;

export const series = sqliteTable('series', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	workoutId: text('workoutId')
		.references(() => workouts.id)
		.notNull(),
	reps: integer('reps').notNull()
});
export type Series = typeof series.$inferSelect;

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
