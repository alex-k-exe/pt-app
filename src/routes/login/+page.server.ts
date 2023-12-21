import * as schema from '$lib/server/drizzle';
import { initLucia } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Argon2id } from 'oslo/password';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from '../formSchema';

export function load() {
	return {
		form: superValidate(formSchema)
	};
}

export const actions: Actions = {
	default: async (event) => {
		// validate data
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// setup tooling
		if (!event.platform) throw new Error('Platform is undefined');
		const lucia = initLucia(event.platform.env.DB);
		const db = drizzle(event.platform.env.DB, { schema });

		const existingUser = await db.query.users.findFirst({
			where: eq(schema.users.username, form.data.username)
		});
		if (!existingUser) return fail(400, { message: 'User does not exist' });

		const passwordIsValid = await new Argon2id().verify(existingUser.password, form.data.password);
		if (!passwordIsValid) return fail(400, { message: 'Incorrect username or password' });

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, { path: '/' });

		throw redirect(302, '/');
	}
};
