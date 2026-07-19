// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://ngomez.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		// El prototipo estiliza `pre` con fondo tinta y texto papel;
		// los colores inline de Shiki lo sobrescribirían.
		syntaxHighlight: false,
	},
});
