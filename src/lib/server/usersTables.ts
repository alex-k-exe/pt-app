import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull()
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const clients = sqliteTable('clients', {
	id: text('id')
		.references(() => users.id)
		.primaryKey(),
	trainerId: text('trainerId')
		.references(() => trainers.id)
		.notNull()
});
export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export const trainers = sqliteTable('trainers', {
	id: text('id')
		.references(() => users.id)
		.primaryKey()
});
export type Trainer = typeof clients.$inferSelect;
export type InsertTrainer = typeof clients.$inferInsert;
