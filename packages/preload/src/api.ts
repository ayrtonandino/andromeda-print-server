import { ipcRenderer } from 'electron'

export function getVersion(): Promise<string> {
    return ipcRenderer.invoke('getVersion')
}

export function closeWindow(): void {
    ipcRenderer.send('closeWindow')
}

export function getCoreData(): Promise<App.Config> {
    return ipcRenderer.invoke('getCoreData')
}

export function setCoreData(value: App.Config): void {
    ipcRenderer.send('setCoreData', value)
}

export function getAvailablePrinters(): Promise<App.PrinterEnum[]> {
    return ipcRenderer.invoke('getAvailablePrinters')
}

export const api = {
    getVersion,
    closeWindow,
    getCoreData,
    setCoreData,
    getAvailablePrinters,
} satisfies App.Api
