import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export async function load({ url }) {
	const targetHref = url.searchParams.get('targetHref');
	return { targetHref, form: await superValidate(zod(formSchema)) };
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const targetHref = formData.get('targetHref')?.toString();
		const signupToken = formData.get('signupToken')?.toString();

		return redirect(302, `/signup/${signupToken}/?targetHref=${targetHref}`);
	}
};
