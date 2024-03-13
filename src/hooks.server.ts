import { D1Adapter, up } from '@auth/d1-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';

const { handle, signIn, signOut } = SvelteKitAuth(async ({ platform }) => {
	const auth = {
		adapter: D1Adapter(platform?.env.DB),
		providers: [
			Google({
				clientId: platform?.env.GOOGLE_ID,
				clientSecret: platform?.env.GOOGLE_SECRET
			})
		],
		secret: platform?.env.AUTHJS_SECRET
	};
	up(platform?.env.DB);
	return auth;
});

export { handle, signIn, signOut };
