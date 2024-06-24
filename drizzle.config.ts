import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	dialect: 'sqlite',
	driver: 'd1-http',
	dbCredentials: {
		accountId: 'd882b81f217373f5c5a94ac9513b3859',
		databaseId: 'dab6f3d7-5933-443d-a617-c645a2b197a5',
		token: 'dTXAt5v5r7yePVh_n--m4Szdqsy'
	},
	schema: 'src/lib/drizzleTables.ts',
	verbose: true,
	strict: true
});
