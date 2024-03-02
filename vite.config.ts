import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), viteCommonjs()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['dayjs']
	},

	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs(['dayjs'])]
		},
		include: ['dayjs']
	}
});
