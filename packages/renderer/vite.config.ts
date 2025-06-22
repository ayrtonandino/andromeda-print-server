import { fileURLToPath, URL } from 'node:url'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },

    plugins: [
        vue(),

        ui({
            ui: {
                colors: {
                    primary: 'indigo',
                    neutral: 'slate',
                },
            },

            autoImport: {
                imports: [
                    'vue',
                    'vue-router',
                ],
            },
        }),
    ],
})
