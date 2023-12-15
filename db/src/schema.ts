import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const children = sqliteTable('children', {
	childId: integer('id').primaryKey(),
	childName: text('name').notNull(),
	presentsWeight: real('presentsWeight').notNull(),
});
