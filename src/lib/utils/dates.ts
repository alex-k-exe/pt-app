import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { validDate } from './types';

dayjs.extend(customParseFormat);
export { dayjs };

/**
 * Generates a matrix of Dayjs objects representing the days of a given month, plus the days before and after to fill the grid.
 * @param month The month for which to generate the matrix (0-indexed).
 * @returns A 5x7 matrix of Dayjs objects representing the days of the month.
 */
export function getDaysForCalendar(month: number, year: number | null): dayjs.Dayjs[][] {
	month = Math.floor(month);
	if (year === null) year = dayjs().year();

	// Find the weekday of the first day of the month (0-6)
	let firstDayOfMonth: number = dayjs(new Date(year, month, 1))
		.startOf('month')
		.day();
	// Adjust so Monday is first day of the week
	firstDayOfMonth = (firstDayOfMonth - 1) % 7;

	// when the day of the month is negative dayjs creates a date in the previous month
	let currentDay: number = 0 - firstDayOfMonth;

	return new Array(5).fill([]).map(() => {
		return new Array(7).fill(null).map(() => {
			currentDay++;
			return dayjs(new Date(year, month, currentDay));
		});
	});
}

export function datesAreSameDay(...dates: dayjs.Dayjs[]) {
	return dates.every((newDate, i) => {
		if (i === 0) return true;
		const previousDate = dates[i - 1];
		return newDate.format(validDate.format) === previousDate.format(validDate.format);
	});
}
