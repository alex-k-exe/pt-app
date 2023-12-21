import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/drizzle.ts',
	out: './drizzle'
} satisfies Config;
