import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths allow the site to work on GitHub Pages project URLs.
export default defineConfig({
  base: './',
  plugins: [react()],
});
