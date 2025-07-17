import { BrowserWindow, ipcMain } from 'electron'
import { getAvailablePrinters } from '../services/printerService.js'
import { appConfigStore } from '../services/storeService.js'

ipcMain.on('closeWindow', (event) => {
    BrowserWindow.getAllWindows()
        .find(window => window.id === event.frameId)
        ?.minimize()
})

ipcMain.handle('getCoreData', () => {
    return appConfigStore.store
})

ipcMain.handle('getAvailablePrinters', () => {
    return getAvailablePrinters()
})

ipcMain.on('setCoreData', (event, value: App.Config) => {
    appConfigStore.set(value)
})
