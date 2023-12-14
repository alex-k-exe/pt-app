export const tasks = sqliteTable('tasks', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	completionAt: integer('completion_at', { mode: 'timestamp' })
});
