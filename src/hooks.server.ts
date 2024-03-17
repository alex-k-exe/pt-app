// const { handle, signIn, signOut } = SvelteKitAuth(async ({ platform }) => {
// 	const auth = {
// 		adapter: D1Adapter(platform?.env.DB),
// 		providers: [
// 			Google({
// 				clientId: dev ? GOOGLE_ID : platform?.env.GOOGLE_ID,
// 				clientSecret: dev ? GOOGLE_SECRET : platform?.env.GOOGLE_SECRET
// 			})
// 		],
// 		secret: dev ? AUTHJS_SECRET : platform?.env.AUTHJS_SECRET
// 	};
// 	up(platform?.env.DB);
// 	return auth;
// });

// export { handle, signIn, signOut };
