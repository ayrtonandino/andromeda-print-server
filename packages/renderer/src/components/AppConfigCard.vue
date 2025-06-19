<script setup lang="ts">
    const props = defineProps<{
        availablePrinters: string[]
        defaultData: App.Config
    }>()

    const emit = defineEmits<{
        'sync:data': []
    }>()

    const printerModel = ref<App.Config['printerModel'] | undefined>()
    const printerUrl = ref<App.Config['printerUrl'] | undefined>()
    const printerPort = ref<App.Config['printerPort'] | undefined>()

    function submit() {
        if (printerModel.value && printerUrl.value && printerPort.value) {
            window.api.setCoreData({
                printerModel: printerModel.value,
                printerUrl: `tcp://${printerUrl.value}`,
                printerPort: printerPort.value,
            })

            emit('sync:data')
        }
    }

    function reset() {
        syncData()
    }

    function syncData() {
        printerUrl.value = String(props.defaultData.printerUrl).replace('tcp://', '')
        printerPort.value = props.defaultData.printerPort
        printerModel.value = props.defaultData.printerModel
    }

    watch(() => props.defaultData, syncData)

    onMounted(() => {
        syncData()
    })
</script>

<template>
    <u-card>
        <template #header>
            <a-title> Configuración </a-title>
        </template>

        <div class="space-y-2">
            <u-form-field label="Modelo de impresora" required>
                <u-select v-model="printerModel" :items="availablePrinters" class="w-full uppercase" />
            </u-form-field>

            <u-form-field label="Dirección de la impresora" required>
                <u-input
                    v-model="printerUrl"
                    class="w-full"
                    placeholder="127.0.0.1"
                    :ui="{
                        base: 'pl-12',
                        leading: 'pointer-events-none',
                    }"
                >
                    <template #leading>
                        <p class="text-sm text-muted">
                            tcp://
                        </p>
                    </template>
                </u-input>
            </u-form-field>

            <u-form-field label="Puerto de la impresora" required>
                <u-input-number v-model="printerPort" class="w-full" :min="0" :max="65535" placeholder="9100" orientation="vertical" />
            </u-form-field>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <u-button color="error" @click="reset">Cancelar</u-button>

                <u-button color="success" @click="submit">Guardar</u-button>
            </div>
        </template>
    </u-card>
</template>
