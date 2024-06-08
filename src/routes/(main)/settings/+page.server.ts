import { clients, users } from '$lib/drizzleTables';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { Scrypt } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { emailSchema, nameSchema, passwordSchema } from './schema';

export async function load(event) {
	if (!event.locals.user?.id) return redirect(302, '/login?targetPath=/settings');

	return {
		user: event.locals.user,
		nameSchema: await superValidate(event, zod(nameSchema)),
		emailSchema: await superValidate(event, zod(await emailSchema(event.locals.db))),
		passwordSchema: await superValidate(
			event,
			zod(await passwordSchema(event.locals.db, event.locals.user.id))
		)
	};
}

export const actions = {
	signout: async ({ cookies, locals }) => {
		return await signout(cookies, locals);
	},

	updateName: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');
		const db = event.locals.db;
		const form = await superValidate(event, zod(nameSchema));
		if (!form.valid) return fail(400, { form });

		await db.update(users).set({ name: form.data.newName }).where(eq(users.id, userId));
	},

	updateEmail: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');
		const db = event.locals.db;
		const form = await superValidate(event, zod(await emailSchema(db)));
		if (!form.valid) return fail(400, { form });

		await db.update(users).set({ email: form.data.newEmail }).where(eq(users.id, userId));
	},

	updatePassword: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');
		const db = event.locals.db;
		const form = await superValidate(event, zod(await passwordSchema(db, userId)));
		if (!form.valid) return fail(400, { form });

		await db
			.update(users)
			.set({ password: await new Scrypt().hash(form.data.newPassword) })
			.where(eq(users.id, userId));
	},

	deleteAccount: async ({ cookies, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return redirect(302, '/login?targetPath=/settings');

		await locals.db
			.delete(clients)
			.where(or(eq(clients.id, userId), eq(clients.trainerId, userId)));

		return await signout(cookies, locals);
	}
};

async function signout(cookies: Cookies, locals: App.Locals) {
	cookies.delete('userType', { path: '/' });
	const sessionId = cookies.get(locals.lucia.sessionCookieName);
	if (sessionId) locals.lucia.invalidateSession(sessionId);
	cookies.delete(locals.lucia.sessionCookieName, { path: '/' });
	return redirect(302, '/login');
}
