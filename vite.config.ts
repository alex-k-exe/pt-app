import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), viteCommonjs(), enhancedImages()],
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
