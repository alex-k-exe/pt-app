import { drizzle } from 'drizzle-orm/d1';

export function initDrizzle(platform: Readonly<App.Platform> | undefined) {
	if (!platform?.env.DB) throw new Error('Database is undefined');
	return drizzle(platform?.env.DB);
}

export function generateSignupToken() {
	const min = 100000;
	const max = 999999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
