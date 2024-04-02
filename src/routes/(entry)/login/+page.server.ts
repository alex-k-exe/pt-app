import { users } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Scrypt } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '../schema';
import type { RouteParams } from './$types';

export async function load() {
	return {
		form: await superValidate(zod(formSchema))
	};
}

async function validateForm(event: RequestEvent<RouteParams, '/(entry)/login'>) {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) return fail(400, { form });
	return form;
}

export const actions = {
	default: async (event) => {
		const formData = (await validateForm(event)).data;
		if ('form' in formData) {
			return formData;
		}
		const existingUser = (
			await initDrizzle(event.platform)
				.select()
				.from(users)
				.limit(1)
				.where(eq(users.email, formData.email))
		)[0];

		if (!existingUser) return fail(400, { message: 'Incorrect username or password' });

		const validPassword = await new Scrypt().verify(existingUser.password, formData.password);
		if (!validPassword) return fail(400, { message: 'Incorrect username or password' });

		const session = await event.locals.lucia.createSession(existingUser.id, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		event.locals.user = existingUser;
		event.locals.session = session;

		redirect(302, '/workouts');
	}
};
