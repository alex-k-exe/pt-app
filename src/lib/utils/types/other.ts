import type { ActivityInsert, Series, Set } from '$lib/drizzleTables';

export const locations: { label: string; value: string }[] = [
	{ label: 'West End', value: 'WEST_END' },
	{ label: 'Albion', value: 'ALBION' },
	{ label: 'Remote', value: 'REMOTE' }
] as const;

export const UserType = {
	CLIENT: 'CLIENT',
	TRAINER: 'TRAINER'
} as const;

export const dayOnlyFormat = 'DD-MM-YYYY';

export type SeriesWithSets = Series & { sets?: Set[] };
export type WorkoutWithSeries = ActivityInsert & {
	date: string;
	series?: SeriesWithSets[];
	sets?: Set[];
};

// require passwords to have one uppercase letter, one digit, and one special character
export const validPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/;
