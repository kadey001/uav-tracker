import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.MAPBOX_TOKEN': JSON.stringify(env.MAPBOX_TOKEN),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      plugins: [react(), tailwindcss()],
      root: './src',
    };
});
