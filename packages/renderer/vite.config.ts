import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
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
