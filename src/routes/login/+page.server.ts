import * as schema from '$lib/server/drizzle';
import { initLucia } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import { Argon2id } from 'oslo/password';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from '../schema';

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
		const db = drizzle(event.platform.env.DB, {schema});

		const existingUser: schema.User[] = await db.query.users.findFirst();
		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await new Argon2id().verify(existingUser., form.data.password);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const session = await lucia.createSession(userId);
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

		throw redirect(302, '/');
	}
};
