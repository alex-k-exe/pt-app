import { fail, redirect } from '@sveltejs/kit';

export async function load({ url }) {
	return {
		error: url.searchParams.get('error')
	};
}

export const actions = {
	default: async (event) => {
		const targetHref = event.url.searchParams.get('targetHref')?.toString();
		const signupToken = (await event.request.formData()).get('signupToken')?.toString().trim();
		if (!signupToken) return fail(400, { form: await event.request.formData() });

		return redirect(
			302,
			`/signup/${signupToken}/` + (targetHref === undefined ? '' : `?targetHref=${targetHref}`)
		);
	}
};
