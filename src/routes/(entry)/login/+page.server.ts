import { users } from '$lib/drizzleTables';
import { initDrizzle, validateForm } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Scrypt } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema.ts';

export async function load({ url }) {
	return {
		targetHref: url.searchParams.get('targetHref'),
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	default: async (event) => {
		const formData = (await validateForm(event, formSchema)).data;

		const existingUser = (
			await initDrizzle(event.platform)
				.select()
				.from(users)
				.limit(1)
				.where(eq(users.email, formData.email))
		)[0];

		if (!existingUser) return fail(400, { message: 'Incorrect username or password' });

		const passwordIsCorrect = await new Scrypt().verify(existingUser.password, formData.password);
		if (!passwordIsCorrect) return fail(400, { message: 'Incorrect username or password' });

		const session = await event.locals.lucia.createSession(existingUser.id, {});
		const sessionCookie = event.locals.lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		event.locals.user = existingUser;
		event.locals.session = session;

		redirect(302, event.url.searchParams.get('targetHref') ?? '/workouts');
	}
};
