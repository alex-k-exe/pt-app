import { initLucia } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// return credentials if user is logged in, otherwise redirect to login
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	return {
		userId: session.user.userId,
		username: session.user.username
	};
};

// logout user invalidating the session and deleting the cookie
export const actions: Actions = {
	logout: async ({ locals, platform }) => {
		const isLoggedIn = await locals.auth.validate();
		if (!isLoggedIn) return fail(401);

		await initLucia(platform?.env.DB).invalidateSession(isLoggedIn.sessionId);
		locals.auth.setSession(null); // delete cookie
		throw redirect(302, '/login');
	}
};
