import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',  // Set the loader to 'jsx' for all .js files
    include: /\.jsx?$/, // Apply this to .js and .jsx files
  },
});
