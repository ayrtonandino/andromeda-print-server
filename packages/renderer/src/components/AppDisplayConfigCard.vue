<script setup lang="ts">
    defineProps<{
        defaultData: App.Config
    }>()
</script>

<template>
    <u-card variant="subtle">
        <template #header>
            <a-title> Configuración Actual </a-title>
        </template>

        <div class="h-32">
            {{ defaultData }}
        </div>

        <template #footer>
            <div class="flex flex-col gap-2">
                <test-connection-button :port="defaultData.serverPort" />

                <test-ticket-button :port="defaultData.serverPort" />

                <test-tag-button :port="defaultData.serverPort" />
            </div>
        </template>
    </u-card>
</template>
