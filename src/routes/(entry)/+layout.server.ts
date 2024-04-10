export async function load({ url }) {
	return {
		targetPath: url.searchParams.get('targetPath')
	};
}
