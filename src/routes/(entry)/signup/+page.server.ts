import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { signupTokenSchema } from './schema.ts';

export async function load() {
	return {
		form: await superValidate(zod(z.object({ signupToken: signupTokenSchema })))
	};
}

export const actions = {
	default: async (event) => {
		const targetPath = event.url.searchParams.get('targetPath')?.toString();
		const form = await superValidate(event, zod(z.object({ signupToken: signupTokenSchema })));
		if (!form.valid) {
			return fail(400, { form });
		}

		return redirect(
			302,
			`/signup/${form.data.signupToken}` +
				(targetPath === undefined ? '' : `?targetPath=${targetPath}`)
		);
	}
};
