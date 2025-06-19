<script setup lang="ts">
    defineProps<{
        defaultData: App.Config
    }>()
</script>

<template>
    <u-card>
        <template #header>
            <div class="h-8" />
        </template>

        <div class="h-32">
            {{ defaultData }}
        </div>

        <template #footer>
            <div class="flex justify-center">
                <test-connection-button />
            </div>
        </template>
    </u-card>
</template>
