import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Change 'custom-build' to your desired directory name
  },
  // base: '/matchcreators/admin-dev'
  base: '/'
});