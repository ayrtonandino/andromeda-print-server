<script setup lang="ts">
    import favicon from '@/assets/icon/favicon.ico'

    function closeWindow() {
        window.api.closeWindow()
    }

    const appVersion = import.meta.env.VITE_APP_VERSION || 'DEVELOPMENT'
</script>

<template>
    <header class="bg-gray-800 border-b border-slate-700">
        <nav style="-webkit-app-region: drag">
            <div class="flex items-center justify-between px-2 py-1">
                <div class="flex-1 flex items-center">
                    <img :src="favicon" class="mr-3 h-6 w-6" name="ANDROMEDA" alt="ANDROMEDA">

                    <h6 class="font-semibold text-white">Andromeda Thermal Print Server - {{ appVersion }}</h6>
                </div>

                <div>
                    <u-tooltip text="Minimizar">
                        <u-button
                            style="-webkit-app-region: no-drag"
                            icon="i-lucide-minus"
                            color="neutral"
                            size="sm"
                            variant="outline"
                            @click="closeWindow"
                        />
                    </u-tooltip>
                </div>
            </div>
        </nav>
    </header>
</template>
