<script setup lang="ts">
    const props = defineProps<{
        defaultData: App.Config
    }>()

    const data = computed(() => {
        return [
            {
                clave: 'Modelo de impresora',
                valor: props.defaultData.printerModel,
            },
            {
                clave: 'Dirección de la impresora',
                valor: props.defaultData.printerUrl,
            },
            {
                clave: 'Puerto de la impresora',
                valor: props.defaultData.printerPort,
            },
            {
                clave: 'Puerto del servidor',
                valor: props.defaultData.serverPort,
            },
        ]
    })
</script>

<template>
    <u-card variant="subtle">
        <u-table variant="subtle" :data="data" />

        <template #footer>
            <div class="flex flex-col gap-2">
                <test-connection-button :port="defaultData.serverPort" />

                <div class="flex gap-2">
                    <test-tag-button :port="defaultData.serverPort" />

                    <test-ticket-button :port="defaultData.serverPort" />
                </div>
            </div>
        </template>
    </u-card>
</template>
