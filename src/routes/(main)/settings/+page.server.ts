import { clients, users } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load(event) {
	if (!event.locals.user?.id) return redirect(302, '/login?targetPath=/settings');
	const db = initDrizzle(event.platform);

	return {
		user: event.locals.user,
		form: await superValidate(event, zod(await formSchema(db, event.locals.user.id)))
	};
}

export const actions = {
	signout: async ({ cookies, locals }) => {
		return await signout(cookies, locals);
	},

	updateAccount: async (event) => {
		const userId = event.locals.user?.id;
		if (!userId) return redirect(302, '/login');
		const db = initDrizzle(event.platform);
		let form = await superValidate(event, zod(await formSchema(db, userId)));
		if (!form.valid) return fail(400, { form });

		await db
			.update(users)
			.set({ password: form.data.newPassword, email: form.data.newEmail })
			.where(eq(users.id, userId));
	},

	deleteAccount: async ({ cookies, locals, platform }) => {
		const userId = locals.user?.id;
		if (!userId) return redirect(302, '/login?targetPath=/settings');

		await initDrizzle(platform)
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
