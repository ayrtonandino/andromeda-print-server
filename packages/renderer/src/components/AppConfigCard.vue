<script setup lang="ts">
    import { useRegle } from '@regle/core'
    import { ipv4Address, number, required, string } from '@regle/rules'

    const props = defineProps<{
        availablePrinters: string[]
        defaultData: App.Config
    }>()

    const emit = defineEmits<{
        'sync:data': []
    }>()

    const form = ref(getEmptyForm())

    const rules = computed(() => ({
        printerModel: { required, string },
        printerUrl: { required, ipv4Address },
        printerPort: { required, number },
    }))

    const { r$ } = useRegle(form, rules)

    function getEmptyForm(): Undefinable<App.Config> {
        return {
            printerModel: undefined,
            printerUrl: undefined,
            printerPort: undefined,
        }
    }

    function submit() {
        if (form.value.printerModel && form.value.printerUrl && form.value.printerPort) {
            window.api.setCoreData({
                printerModel: form.value.printerModel,
                printerUrl: `tcp://${form.value.printerUrl}`,
                printerPort: form.value.printerPort,
            })

            emit('sync:data')
        }
    }

    function reset() {
        syncData()
    }

    function syncData() {
        form.value = {
            printerUrl: String(props.defaultData.printerUrl).replace('tcp://', ''),
            printerPort: props.defaultData.printerPort,
            printerModel: props.defaultData.printerModel,
        }

        r$.$reset()
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
            <u-form-field label="Modelo de impresora" :error="r$.$fields.printerModel.$error">
                <u-select v-model="form.printerModel" :items="availablePrinters" class="w-full uppercase" />
            </u-form-field>

            <u-form-field label="Dirección de la impresora" :error="r$.$fields.printerUrl.$error">
                <u-input
                    v-model="form.printerUrl" class="w-full" placeholder="127.0.0.1" :ui="{
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

            <u-form-field label="Puerto de la impresora" :error="r$.$fields.printerPort.$error">
                <u-input-number
                    v-model="form.printerPort" class="w-full" :min="0" :max="65535" placeholder="9100"
                    orientation="vertical"
                />
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
