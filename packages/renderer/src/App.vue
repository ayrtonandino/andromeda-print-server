<script setup lang="ts">
    const availablePrinters = ref<App.PrinterEnum[]>([])

    const defaultData = ref<App.Config | undefined>()

    async function getData() {
        availablePrinters.value = await window.api.getAvailablePrinters()

        defaultData.value = await window.api.getCoreData()
    }

    onMounted(() => {
        getData()
    })
</script>

<template>
    <u-app>
        <app-nav-bar />

        <u-container class="py-2">
            <div v-if="defaultData" class="grid grid-cols-2 gap-6">
                <div>
                    <app-config-card :available-printers="availablePrinters" :default-data="defaultData" @sync:data="getData" />
                </div>

                <div>
                    <app-display-config-card :default-data="defaultData" />
                </div>
            </div>
        </u-container>
    </u-app>
</template>
