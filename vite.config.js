import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Must match the GitHub Pages repository sub-path
  base: '/cfp-sim-couts/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
