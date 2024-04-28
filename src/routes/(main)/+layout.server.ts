import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.userType) return redirect(302, `/login?targetPath=${url.pathname}`);

	return {
		userType: locals.userType,
		error: url.searchParams.get('error'),
		pathName: url.pathname
	};
}
