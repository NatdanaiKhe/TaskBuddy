import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
      'components': '/src/components',
      'context': '/src/context',
      'services': '/src/services',
      'styles': '/src/styles',
      'types': '/src/types',
      'pages': '/src/pages',
      'layouts': '/src/layouts',
      'api': '/src/api'},
  },
  server: {
    port: 3000,
  },
});
