import { initDrizzle, validateForm } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ platform }) {
	return { form: await superValidate(zod(await formSchema(initDrizzle(platform)))) };
}

export const actions = {
	default: async (event) => {
		const formData = (await validateForm(event, formSchema)).data;
		if ('form' in formData) return formData;

		const targetHref = event.url.searchParams.get('targetHref')?.toString();
		const signupToken = formData.signupToken;

		return redirect(
			302,
			`/signup/${signupToken}/` + (targetHref ? `?targetHref=${targetHref}` : '')
		);
	}
};
