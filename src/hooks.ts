import type { Handle } from '@sveltejs/kit';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';

export const handle: Handle = async ({ event, resolve }) => {
	dayjs.extend(updateLocale);
	dayjs.extend(timezone);
	dayjs.updateLocale('en', {
		weekStart: 1
	});
	return await resolve(event);
};
