import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/server/drizzleTables.ts',
	driver: 'd1',
	dbCredentials: {
		wranglerConfigPath: './wrangler.toml',
		dbName: 'pt-app-prod'
	},
	verbose: true,
	strict: true
});
