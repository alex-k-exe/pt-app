import { clients, users } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { userTypes } from '$lib/utils/types/other.ts';
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
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) return fail(400, { form });
		const db = initDrizzle(event.platform);

		const existingUser = (
			await db.select().from(users).limit(1).where(eq(users.email, form.data.email))
		)[0];

		if (!existingUser) return fail(400, { message: 'Incorrect username or password' });

		const passwordIsCorrect = await new Scrypt().verify(existingUser.password, form.data.password);
		if (!passwordIsCorrect) return fail(400, { message: 'Incorrect username or password' });

		const client = await db
			.select()
			.from(clients)
			.leftJoin(users, eq(users.id, clients.id))
			.where(eq(users.id, existingUser.id));

		const session = await event.locals.lucia.createSession(existingUser.id, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		event.cookies.set('userType', client.length === 1 ? userTypes.CLIENT : userTypes.TRAINER, {
			path: '.'
		});

		return redirect(302, event.url.searchParams.get('targetPath') ?? '/workouts');
	}
};
