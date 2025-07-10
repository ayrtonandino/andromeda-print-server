<script setup lang="ts">
    import axios from 'axios'

    const props = defineProps<{
        port: App.Config['serverPort']
    }>()

    const toast = useToast()

    const ticketData: TicketData = {
        id: 1056,
        fecha: '2025-06-10T19:30:28.000000Z',
        fechaCambio: '2025-07-10T19:30:28.000000Z',
        sucursal: {
            nombre: 'Mi Sucursal',
            domicilio: 'RIBERA SHOPPING LOC NPSF-N00-LO000 0 S:DIQ 1 - SANTA FE - SANTA FE',
        },
        cliente: {
            dni: 25500000,
            apellido: 'APELLIDO',
            nombre: 'NOMBRE',
        },
        articulos: [
            {
                cantidad: 1,
                codigo: 'C048P064870708300S',
                producto: 'CAMPERA MARTE',
                color: 'NEGRO',
                talle: 'S',
            },
            {
                cantidad: 1,
                codigo: 'C048P064870608300L',
                producto: 'PANTALON MARTE',
                color: null,
                talle: null,
            },
        ],
    } satisfies TicketData

    async function testConnection(): Promise<void> {
        return axios
            .post(`http://localhost:${props.port}/print`, ticketData)
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
    <u-button color="info" block loading-auto @click="testConnection">Probar Ticket</u-button>
</template>
