import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.AIzaSyDjLfnp-i3SKJoDUd0Axj2JwM3KLPUObfA': JSON.stringify(env.AIzaSyDjLfnp-i3SKJoDUd0Axj2JwM3KLPUObfA),
        'process.env.AIzaSyDjLfnp-i3SKJoDUd0Axj2JwM3KLPUObfA': JSON.stringify(env.AIzaSyDjLfnp-i3SKJoDUd0Axj2JwM3KLPUObfA)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
