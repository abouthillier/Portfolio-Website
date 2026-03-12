import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/site.css',
                'resources/js/site.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    optimizeDeps: {
        include: ['three']
    },
    server: {
        host: true,
        port: 5174,
        strictPort: true,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 5174,
            clientPort: 5174,
        },
    }
});
