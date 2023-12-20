import { users } from '$lib/server/drizzle';
import { initLucia } from '$lib/server/lucia';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = () => {
	return {
		form: superValidate(formSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		// validate data
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// create userId and hash password
		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(form.data.password);

		// setup tooling
		const lucia = initLucia(event.platform.env.DB);
		const db = drizzle(event.platform?.env.DB);

		// insert user into db
		await db
			.insert(users)
			.values({ id: userId, username: form.data.username, password: hashedPassword });

		// create new session and store in cookies
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, { path: '/' });

		throw redirect(302, '/');
	}
};
