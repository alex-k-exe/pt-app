import { initDrizzle } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ platform }) {
	return { form: await superValidate(zod(await formSchema(initDrizzle(platform)))) };
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(await formSchema(initDrizzle(event.platform))));
		if (!form.valid) return fail(400, { form });

		const targetHref = event.url.searchParams.get('targetHref')?.toString();
		const signupToken = (await event.request.formData()).get('signupToken')?.toString();

		return redirect(302, `/signup/${signupToken}/` + (targetHref ? targetHref : ''));
	}
};
