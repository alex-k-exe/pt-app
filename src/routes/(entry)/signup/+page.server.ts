import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { signupTokenSchema } from './schema.js';

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
		const signupToken = (await event.request.formData()).get('signupToken');
		const validatedToken = signupTokenSchema.safeParse(signupToken);
		if (!validatedToken.success) {
			return fail(400, { error: validatedToken.error.errors[0].message });
		}
		console.log('after');

		return redirect(
			302,
			`/signup/${validatedToken.data}/` +
				(targetPath === undefined ? '' : `?targetPath=${targetPath}`)
		);
	}
};
