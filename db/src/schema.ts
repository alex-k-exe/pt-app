import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const children = sqliteTable('children', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	presentsWeight: real('presentsWeight').notNull(),
});
