import { initLucia } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) throw redirect(302, '/login');
	return { username: locals.user.username };
}

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		if (!event.platform) return fail(500, { message: 'Home page: Platform is undefined' });
		const auth = initLucia(event.platform?.env.DB);

		await auth.invalidateSession(event.locals.session.id);
		const blankSessionCookie = auth.createBlankSessionCookie();
		event.cookies.set(blankSessionCookie.name, blankSessionCookie.value, { path: '/' });
		throw redirect(302, '/login');
	}
};
