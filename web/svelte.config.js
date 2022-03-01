import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      postcss: true
    })
  ],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false
    }),
    prerender: {
      enabled: true
    }
    /*
		If you need to serve your file from a sub directory
		paths: {
				base: '/your-sub-dir',
		},
		*/
  }
};

export default config;
