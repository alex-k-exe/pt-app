import { fail } from '@sveltejs/kit';

export function load({ params }) {
	const signupToken = params.signupToken;
	if (!signupToken) return fail(404);

	return { signupToken };
}
