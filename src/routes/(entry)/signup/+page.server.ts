import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { signupTokenSchema } from './schema.ts';

export async function load({ url }) {
	return {
		asyncValidationError: url.searchParams.get('error'),
		form: await superValidate(zod(z.object({ signupToken: signupTokenSchema })))
	};
}

export const actions = {
	default: async (event) => {
		console.log('start');
		const targetPath = event.url.searchParams.get('targetPath')?.toString();
		const form = await superValidate(event, zod(z.object({ signupToken: signupTokenSchema })));
		if (!form.valid) {
			return fail(400, { form });
		}
		console.log('after');

		return redirect(
			302,
			`/signup/${form.data.signupToken}/` +
				(targetPath === undefined ? '' : `?targetPath=${targetPath}`)
		);
	}
};
