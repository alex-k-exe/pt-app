import dayjs, { Dayjs } from 'dayjs';

/**
 * Generates a matrix of Dayjs objects representing the days of a given month.
 * @param month The month for which to generate the matrix (0-indexed).
 * @returns A 5x7 matrix of Dayjs objects representing the days of the month.
 */
export function getDaysOfMonth(month: number): Dayjs[][] {
	month = Math.floor(month);
	const year: number = dayjs().year();

	// Find the weekday of the first day of the month (0-6)
	const firstDayOfMonth: number = dayjs(new Date(year, month, 1))
		.startOf('month')
		.day();

	let currentDay: number = 0 - firstDayOfMonth;

	return new Array(5).fill([]).map(() => {
		return new Array(7).fill(null).map(() => {
			currentDay++;
			return dayjs(new Date(year, month, currentDay));
		});
	});
}
