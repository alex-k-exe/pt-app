import { clients, users } from '$lib/drizzleTables';
import { userTypes } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema.ts';

export async function load({ locals }) {
	return {
		form: await superValidate(zod(await formSchema(locals.db)))
	};
}

export const actions = {
	default: async (event) => {
		const db = event.locals.db;
		const form = await superValidate(event, zod(await formSchema(db)));
		if (!form.valid) return fail(400, { form });

		const existingUser = (
			await db.select().from(users).limit(1).where(eq(users.email, form.data.email))
		)[0];
		const client = await db
			.select()
			.from(clients)
			.innerJoin(users, eq(users.id, clients.id))
			.where(eq(users.id, existingUser.id));

		const session = await event.locals.lucia.createSession(existingUser.id, {});
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
