import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull(),
	password: text('password').notNull()
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
