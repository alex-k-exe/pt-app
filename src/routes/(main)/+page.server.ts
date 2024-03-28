import { redirect } from '@sveltejs/kit';

export async function load(event) {
	if (!event.locals.user) redirect(302, '/login');

	return {
		user: event.locals.user
	};
}
