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
            label: 'Impresora',
            icon: 'i-lucide-printer',
            slot: 'config' as const,
        },
    ] satisfies TabsItem[]

    const UPinInputRef = useTemplateRef('UPinInputRef')
    const { openModal, password, submit } = usePasswordCheck(UPinInputRef)

    const form = ref(getEmptyForm())

    const rules = computed(() => ({
        printerModel: { required, string },
        printerUrl: { required, ipv4Address },
        printerPort: { required, number },
        openOnStartUp: { boolean },
        ticketShowDisclaimer: { boolean },
        ticketShowSucursal: { boolean },
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
            ticketShowDisclaimer: false,
            ticketShowSucursal: false,
            ticketShowClient: false,
            ticketShowItems: false,
            ticketShowQr: false,
        }
    }

    function shouldSubmit() {
        r$.$touch()

        if (r$.$correct) {
            openModal.value = true
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

    function usePasswordCheck(input: typeof UPinInputRef) {
        const openModal = ref(false)
        const password = ref<number[]>([])

        watch(openModal, (value): void => {
            if (value) {
                resetPin()
            }
        })

        const canSubmit = computed((): boolean => {
            const value = Number(password.value.join(''))

            if (value === 292300) {
                return true
            }

            return false
        })

        function submit() {
            if (!canSubmit.value) {
                resetPin()

                return
            }

            window.api.setCoreData({
                ...form.value,
                printerUrl: `tcp://${form.value.printerUrl}`,
            })

            emit('sync:data')

            openModal.value = false
        }

        function resetPin() {
            password.value = []

            const container = input.value?.inputsRef

            if (container && container[0]) {
                (container[0].$el as HTMLInputElement).focus()
            }
        }

        return {
            openModal,
            password,
            submit,
        }
    }
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

                <u-form-field label="Puerto del servidor" :error="r$.$fields.serverPort.$error">
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
                    v-model="form.ticketShowDisclaimer"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir leyenda de cambio"
                />

                <u-switch
                    v-model="form.ticketShowSucursal"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir información de la sucursal"
                />

                <u-switch
                    v-model="form.ticketShowClient"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir información del cliente"
                />

                <u-switch
                    v-model="form.ticketShowItems"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir artículos vendidos"
                />

                <u-switch
                    v-model="form.ticketShowQr"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Incluir QR de cambio Andromeda"
                />
            </template>
        </u-tabs>

        <template v-if="r$.$anyDirty" #footer>
            <div class="flex gap-3 justify-end">
                <u-button block color="error" @click="reset">Cancelar</u-button>

                <u-button block color="success" @click="shouldSubmit">Guardar</u-button>
            </div>
        </template>
    </u-card>

    <u-modal v-model:open="openModal" :dismissible="false" title="Guardar nueva configuración" description="Ingrese su clave de seis dígitos">
        <template #body>
            <div class="flex items-center flex-col gap-6">
                <u-pin-input
                    ref="UPinInputRef"
                    v-model="password"
                    autofocus
                    type="number"
                    :length="6"
                    mask
                    @complete="submit"
                />
            </div>
        </template>
    </u-modal>
</template>
