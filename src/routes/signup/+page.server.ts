import { initLucia } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from '../formSchema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) return fail(400, { form });

		const auth = initLucia(event.platform!.env.DB);

		const newUser = await auth.createUser({
			key: {
				providerId: 'username',
				// TODO check if d1 is case sensitive
				providerUserId: form.data.username.toLowerCase(),
				password: form.data.password // hashed by Lucia
			},
			attributes: {
				username: form.data.username
			}
		});
		const newSession = await auth.createSession({
			userId: newUser.userId,
			attributes: {}
		});
		event.locals.auth.setSession(newSession);

		throw redirect(302, '/');
	}
};
