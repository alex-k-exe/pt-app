import { initLucia } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const db = initLucia(platform?.env.DB);

		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		// basic validation
		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		// validated, now create user and session
		const user = await db.createUser({
			key: {
				providerId: 'username', // auth method
				// TODO check whether d1 is case sensitive
				providerUserId: username.toLowerCase(),
				password // hashed by Lucia
			},
			attributes: {
				username
			}
		});
		const session = await db.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session); // set session cookie
		throw redirect(302, '/');
	}
};
