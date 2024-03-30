import type { Handle } from '@sveltejs/kit';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';

export const handle: Handle = async ({ event, resolve }) => {
	dayjs.extend(updateLocale);
	dayjs.extend(timezone);
	dayjs.updateLocale('en', {
		weekStart: 1
	});
	dayjs.extend(customParseFormat);
	return await resolve(event);
};
