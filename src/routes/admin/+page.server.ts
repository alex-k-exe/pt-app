import { ADMIN_PASSWORD } from '$env/static/private';
import { signupTokens } from '$lib/drizzleTables';
import { generateSignupToken, initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';

export const actions = {
	default: async ({ platform, request }) => {
		const password = (await request.formData()).get('password');
		if (password !== ADMIN_PASSWORD) return fail(400);

		const signupToken = generateSignupToken();
		await initDrizzle(platform)
			.insert(signupTokens)
			.values({ id: signupToken, creationTimeDate: dayjs().toString() });

		return redirect(302, `/admin/${signupToken}`);
	}
};
