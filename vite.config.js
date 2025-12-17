import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
  /*
	//If we want to build a local version (that uses local services)
	define: {
		'process.env.VITE_LOCAL': 'true'
	}*/
});
