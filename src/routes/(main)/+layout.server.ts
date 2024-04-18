export async function load({ locals, url }) {
	return {
		userType: locals.userType,
		error: url.searchParams.get('error')
	};
}
