import { clients, trainers, users } from '$lib/drizzleTables';
import { userTypes } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Scrypt } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema.ts';

export async function load() {
	return {
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	default: async (event) => {
		const db = event.locals.db;
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });

		const existingUser = await db
			.select()
			.from(users)
			.limit(1)
			.where(eq(users.email, form.data.email));
		const verified =
			existingUser.length === 1 &&
			new Scrypt().verify(existingUser[0].password, form.data.password);
		if (!verified) return redirect(302, '/login?error=Email or password is incorrect');

		const client = await db
			.select()
			.from(clients)
			.limit(1)
			.where(eq(clients.id, existingUser[0].id));
		const trainer = await db
			.select()
			.from(trainers)
			.limit(1)
			.where(eq(trainers.id, existingUser[0].id));

		if (client.length === 0 && trainer.length === 0) {
			await db.delete(users).where(eq(users.id, existingUser[0].id));
			return redirect(302, '/login?error=Email or password is incorrect');
		}

		const session = await event.locals.lucia.createSession(existingUser[0].id, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});
		event.cookies.set('userType', client.length === 1 ? userTypes.CLIENT : userTypes.TRAINER, {
			path: '/'
		});

		return redirect(302, event.url.searchParams.get('targetPath') ?? '/workouts');
	}
};
