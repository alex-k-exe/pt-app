import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ url }) {
	return { error: url.searchParams.get('error'), form: await superValidate(zod(formSchema)) };
}

export const actions = {
	default: async ({ url, request }) => {
		const targetHref = url.searchParams.get('targetHref')?.toString();
		const signupToken = (await request.formData()).get('signupToken')?.toString();

		return redirect(302, `/signup/${signupToken}/?targetHref=${targetHref}`);
	}
};
