import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://34.228.115.185', // Backend API
  //       changeOrigin: true,
  //       secure: false, // Set to true if using a valid SSL certificate
  //       ws: true, // Enable WebSocket proxying (if needed)
  //       configure: (proxy, options) => {
  //         console.log("Proxy Config:", options);
  //       },
  //       rewrite: (path) => path.replace(/^\/api/, '') // Remove '/api' prefix
  //     }
  //   }
  // }
});
