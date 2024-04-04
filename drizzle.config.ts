import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/drizzleTables.ts',
	driver: 'd1',
	dbCredentials: {
		wranglerConfigPath: './wrangler.toml',
		dbName: 'pt-app'
	},
	verbose: true,
	strict: true
});
