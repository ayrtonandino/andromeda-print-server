<script setup lang="ts">
    import axios from 'axios'

    const props = defineProps<{
        port: App.Config['serverPort']
    }>()

    const toast = useToast()

    async function testConnection(): Promise<void> {
        return axios
            .get(`http://localhost:${props.port}/status`)
            .then((response) => {
                toast.add({
                    title: 'Success',
                    description: response?.data?.status || 'Conexión exitosa',
                    icon: 'i-lucide-wifi',
                    color: 'success',
                })
            })
            .catch((error) => {
                toast.add({
                    title: 'Error',
                    description: error?.response?.data?.error || 'Conexión Fallida',
                    icon: 'i-lucide-wifi-off',
                    color: 'error',
                })
            })
    }
</script>

<template>
    <u-button color="success" block loading-auto @click="testConnection">Probar Conexión</u-button>
</template>
