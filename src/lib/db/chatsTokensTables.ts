import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { trainers, users } from './usersTables';

// Drizzle ensures type safety in the queried data from the DB
// The 9 tables defined with sqliteTable() are converted to SQL code by drizzle-kit in the CLI
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
export type InsertChat = typeof chats.$inferInsert;

export const messages = sqliteTable('chats', {
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
export type InsertMessage = typeof messages.$inferInsert;

export const signupTokens = sqliteTable('signupTokens', {
	id: text('id').primaryKey(),
	trainerId: text('trainerId').references(() => trainers.id),
	creationTimestamp: text('creationTimestamp').notNull()
});
