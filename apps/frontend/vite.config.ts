import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ui': resolve(__dirname, 'src/components/ui'),
    },
  },
  envDir: resolve(__dirname, '../../environment/frontend'),
});
