import type { Config } from 'drizzle-kit';

export default {
	schema: './src/schema.ts',
	out: './drizzle',
	verbose: true,
	strict: true,
} satisfies Config;
