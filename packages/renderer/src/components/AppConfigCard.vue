<script setup lang="ts">
    import type { TabsItem } from '@nuxt/ui'
    import { useRegle } from '@regle/core'
    import { boolean, ipv4Address, number, required, string } from '@regle/rules'

    const props = defineProps<{
        availablePrinters: App.PrinterEnum[]
        defaultData: App.Config
    }>()

    const emit = defineEmits<{
        'sync:data': []
    }>()

    const tabsItem = [
        {
            label: 'Ticket',
            icon: 'i-lucide-ticket',
            slot: 'ticket' as const,
        },
        {
            label: 'Configuración',
            icon: 'i-lucide-cog',
            slot: 'config' as const,
        },
    ] satisfies TabsItem[]

    const form = ref(getEmptyForm())

    const rules = computed(() => ({
        printerModel: { required, string },
        printerUrl: { required, ipv4Address },
        printerPort: { required, number },
        openOnStartUp: { boolean },
        ticketShowClient: { boolean },
        ticketShowItems: { boolean },
        ticketShowQr: { boolean },
    }))

    const { r$ } = useRegle(form, rules)

    function getEmptyForm(): App.Config {
        return {
            printerModel: props.availablePrinters[0],
            printerUrl: '',
            printerPort: 0,
            serverPort: 0,
            openOnStartUp: false,
            ticketShowClient: false,
            ticketShowItems: false,
            ticketShowQr: false,
        }
    }

    function submit() {
        r$.$touch()

        if (r$.$correct) {
            window.api.setCoreData({
                ...form.value,
                printerUrl: `tcp://${form.value.printerUrl}`,
            })

            emit('sync:data')
        }
    }

    function reset() {
        syncData()
    }

    function syncData() {
        form.value = {
            ...props.defaultData,
            printerUrl: String(props.defaultData.printerUrl).replace('tcp://', ''),
        }

        r$.$reset()
    }

    watch(() => props.defaultData, syncData)

    onMounted(() => {
        syncData()
    })
</script>

<template>
    <u-card variant="subtle">
        <u-tabs :items="tabsItem" :ui="{ trigger: 'grow', content: 'space-y-2' }">
            <template #config>
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

                <u-form-field
                    label="Puerto del servidor"
                    description="Requiere reiniciar la aplicación manualmente"
                    :error="r$.$fields.serverPort.$error"
                >
                    <u-input-number
                        v-model="form.serverPort" class="w-full" :min="0" :max="65535" placeholder="3005"
                        orientation="vertical"
                    />
                </u-form-field>

                <u-switch
                    v-model="form.openOnStartUp"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Iniciar plugin automáticamente"
                />
            </template>

            <template #ticket>
                <u-switch
                    v-model="form.ticketShowClient"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir información de Cliente"
                />

                <u-switch
                    v-model="form.ticketShowItems"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir Artículos"
                />

                <u-switch
                    v-model="form.ticketShowQr"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir QR"
                />
            </template>
        </u-tabs>

        <template v-if="r$.$anyDirty" #footer>
            <div class="flex gap-3 justify-end">
                <u-button color="error" @click="reset">Cancelar</u-button>

                <u-button color="success" @click="submit">Guardar</u-button>
            </div>
        </template>
    </u-card>
</template>
