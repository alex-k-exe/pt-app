import { ADMIN_PASSWORD } from '$env/static/private';
import { signupTokens } from '$lib/drizzleTables';
import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ platform, request }) => {
		const password = (await request.formData()).get('password');
		if (password !== ADMIN_PASSWORD) return fail(400);

		const signupToken = await initDrizzle(platform).insert(signupTokens).values({}).returning();

		return redirect(302, `/admin/${signupToken[0].id}`);
	}
};
