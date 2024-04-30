export async function load({ url }) {
	return {
		error: url.searchParams.get('error'),
		targetPath: url.searchParams.get('targetPath')
	};
}
