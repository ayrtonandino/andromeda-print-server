import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

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

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ['vue', 'vue-router', 'reka-ui', '@unhead/vue'],
                    axios: ['axios'],
                    vueuse: ['@vueuse/core'],
                    regle: ['@regle/core', '@regle/rules'],
                },
            },
        },
    },
})
