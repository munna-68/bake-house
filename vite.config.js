import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
    base: '/bake-house/',
    plugins: [
        react(),
        tailwindcss(),
        {
            name: 'cookies-root-rewrite',
            configureServer(server) {
                server.middlewares.use((req, _res, next) => {
                    if (req.url && req.url.startsWith('/cookies/')) {
                        req.url = '/bake-house' + req.url;
                    }
                    next();
                });
            },
        },
    ],
    server: {
        port: 5188,
        host: '127.0.0.1',
        strictPort: true,
    },
    preview: {
        port: 5189,
        host: '127.0.0.1',
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        target: 'es2020',
    },
});
