<script setup lang="ts">
    import axios from 'axios'

    const props = defineProps<{
        port: App.Config['serverPort']
    }>()

    const toast = useToast()

    const tagData: TagData[] = [
        {
            codigo: '745sfa0001bXXXX',
            producto: 'producto',
            color: 'color',
            talle: 'talle',
        },
    ] satisfies TagData[]

    async function testConnection(): Promise<void> {
        return axios
            .post(
                `http://localhost:${props.port}/tag`,
                tagData,
            )
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
    <u-button block loading-auto @click="testConnection">Probar Etiqueta</u-button>
</template>
