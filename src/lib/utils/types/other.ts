import type { ActivityInsert, SeriesInsert, SetInsert } from '$lib/drizzleTables';

export const locations = {
	WEST_END: 'West End',
	ALBION: 'Albion',
	REMOTE: 'Remote'
} as const;

export const userTypes = {
	CLIENT: 'Client',
	TRAINER: 'Trainer'
} as const;

export const dayOnlyFormat = 'DD-MM-YYYY';
export const timeOnlyFormat = 'h:m-A';
export const months = {
	JANUARY: 'January',
	FEBRUARY: 'February',
	MARCH: 'March',
	APRIL: 'April',
	MAY: 'May',
	JUNE: 'June',
	JULY: 'July',
	AUGUST: 'August',
	SEPTEMBER: 'September',
	OCTOBER: 'October',
	NOVEMBER: 'November',
	DECEMBER: 'December'
} as const;
export const daysOfTheWeek = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
] as const;

type SimpleSet = Omit<SetInsert, 'activityId' & 'seriesId'>;
export type SeriesWithSets = Omit<SeriesInsert, 'activityId'> & { sets: SimpleSet[] };
export type WorkoutWithSeries = ActivityInsert & {
	date: Date;
	series: SeriesWithSets[];
	sets: SimpleSet[];
};

// require passwords to have one uppercase letter, one digit, and one special character
export const validPassword = {
	regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/,
	message: 'At least one uppercase and lowercase letter, one number and one special character'
};

export type ObjectValues<T> = T[keyof T];
