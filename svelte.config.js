import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csrf: {
			// in the real app I used a cloudflare D1 database instead of a local sqlite file
			// so this wasn't needed
			checkOrigin: false
		}
	}
};

export default config;
