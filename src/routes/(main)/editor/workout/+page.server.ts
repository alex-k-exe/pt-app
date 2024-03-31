export async function load({ url, locals }) {
	return {
		date: url.searchParams.get('date'),
		workout: url.searchParams.get('workout'),
		userType: locals.userType
	};
}
