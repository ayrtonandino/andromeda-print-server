import { ipcRenderer } from 'electron'
import { PrinterTypes } from 'node-thermal-printer'
import configStore from './createStore.js'

export function closeWindow(): void {
    ipcRenderer.send('closeWindow')
}

export function getCoreData(): App.Config {
    return configStore.store
}

export function setCoreData(value: App.Config): void {
    configStore.set(value)
}

export function getAvailablePrinters(): PrinterTypes[] {
    return Object.values(PrinterTypes)
}

export const api = {
    closeWindow,
    getCoreData,
    setCoreData,
    getAvailablePrinters,
}
