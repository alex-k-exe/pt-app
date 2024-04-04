export async function load({ url }) {
	return {
		targetHref: url.searchParams.get('targetHref')
	};
}
