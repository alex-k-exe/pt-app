import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/drizzleTables.ts',
	dbCredentials: {
		url: './local.db'
	}
});
