// TODO: generalise this
export const locations = {
	LOC1: 'Location 1',
	LOC2: 'Location 2',
	REMOTE: 'Remote'
} as const;

export const userTypes = {
	CLIENT: 'Client',
	TRAINER: 'Trainer'
} as const;

export const validMonthDate = { regex: /(?:19|20)\d{2}-(?:0[1-9]|1[0-2])/, format: 'YYYY-MM' };
export const validDate = {
	regex: /(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/,
	format: 'YYYY-MM-DD'
};
// TODO: make a more consisent time format
export const validTime = 'h:mm a';

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

export const validEmail = { regex: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/gm, message: 'Invalid email' };
// require passwords to have one uppercase letter, one digit, and one special character
export const validPassword = {
	regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/,
	message: 'At least one uppercase and lowercase letter, one number and one special character'
};
export const validActiveDays = /^[01]{7}$/;
export const validNaturalNumber = /^[1-9]\d*$/;

export type ObjectValues<T> = T[keyof T];
