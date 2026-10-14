<script setup lang="ts">
    import axios from 'axios'

    const props = defineProps<{
        port: App.Config['serverPort']
    }>()

    const toast = useToast()

    const facturaBData: FacturaBData = {
        comprobante: {
            codigo: 6,
            puntoVenta: 1,
            numero: 1,
            fechaEmision: '2026-10-08',
        },
        emisor: {
            razonSocial: 'COMERCIO DE PRUEBA',
            cuit: '00-00000000-0',
            domicilioComercial: 'DOMICILIO DE PRUEBA',
            ingresosBrutos: '000000000',
            condicionIva: 'IVA RESPONSABLE INSCRIPTO',
            inicioActividades: '2000-01-01',
        },
        receptor: {
            tipoDocumento: 'DNI',
            numeroDocumento: '00000000',
            nombreApellido: 'CLIENTE DE PRUEBA',
            condicionIva: 'CONSUMIDOR FINAL',
            condicionVenta: 'CONTADO',
        },
        articulos: [
            {
                codigo: 'PRUEBA-001',
                producto: 'ARTICULO DE PRUEBA',
                cantidad: 1,
                importeTotal: 15000,
            },
        ],
        importeTotalEnLetras: 'QUINCE MIL CON 00/100 PESOS',
        importeNetoGravado: 12396.69,
        ivaContenido: 2603.31,
        otrosImpuestosNacionalesIndirectos: 0,
        importeTotal: 15000,
        cae: '00000000000000',
        fechaVencimientoCae: '2026-10-18',
        qr_data: 'factura-b-prueba',
    } satisfies FacturaBData

    async function testConnection(): Promise<void> {
        return axios
            .post(`http://localhost:${props.port}/print/factura-b`, facturaBData)
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
    <u-button color="info" block loading-auto @click="testConnection">Probar Factura B</u-button>
</template>
