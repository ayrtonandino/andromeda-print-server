import ui from '@nuxt/ui/vue-plugin'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'

const app = createApp(App)

const router = createRouter({
    routes: [
        { path: '/', component: () => import('./App.vue') },
    ],
    history: createWebHistory(),
})

app.use(router)
app.use(ui)

app.mount('#app')
