<script setup lang="ts">
    import axios from 'axios'

    const toast = useToast()

    async function testConnection() {
        return axios
            .get('http://localhost:3005/status')
            .then((response) => {
                toast.add({
                    title: 'Success',
                    description: response?.data?.status || 'Connection successful',
                    icon: 'i-lucide-wifi',
                    color: 'success',
                })
            })
            .catch((error) => {
                toast.add({
                    title: 'Error',
                    description: error?.response?.data?.error || 'Connection failed',
                    icon: 'i-lucide-wifi-off',
                    color: 'error',
                })
            })
        // )
    }
</script>

<template>
    <u-button loading-auto @click="testConnection">Probar Conexión</u-button>
</template>
