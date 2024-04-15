import { users } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { changeEmailSchema, changePasswordSchema } from './schema';

export async function load(event) {
	if (!event.locals.user?.id) return redirect(302, '/login?targetPath=/settings');
	const db = initDrizzle(event.platform);

	return {
		user: event.locals.user,
		changePasswordForm: await superValidate(
			event,
			zod(await changePasswordSchema(db, event.locals.user?.id))
		),
		changeEmailForm: await superValidate(event, zod(await changeEmailSchema(db)))
	};
}

export const actions = {
	signout: async ({ cookies, locals }) => {
		cookies.delete('userType', { path: '/' });
		const sessionId = cookies.get(locals.lucia.sessionCookieName);
		if (sessionId) locals.lucia.invalidateSession(sessionId);
		cookies.delete(locals.lucia.sessionCookieName, { path: '/' });
		return redirect(302, '/login');
	},

	changePassword: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login?targetPath=/settings');
		const db = initDrizzle(event.platform);
		let form = await superValidate(event, zod(await changePasswordSchema(db, userId)));
		if (!form.valid) return fail(400, { form });

		await db.update(users).set({ password: form.data.newPassword }).where(eq(users.id, userId));
	},

	changeEmail: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');
		const db = initDrizzle(event.platform);
		let form = await superValidate(event, zod(await changeEmailSchema(db)));
		if (!form.valid) return fail(400, { form });

		await db.update(users).set({ password: form.data.newEmail }).where(eq(users.id, userId));
	},

	deleteAccount: async ({ locals, platform }) => {
		const userId = locals.user?.id;
		if (!userId) return redirect(302, '/login?targetPath=settings');
		await initDrizzle(platform).delete(users).where(eq(users.id, userId));
		return redirect(302, '/settings?/signout');
	}
};
