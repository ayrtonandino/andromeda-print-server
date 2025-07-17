import { app, BrowserWindow, ipcMain } from 'electron'
import { getAvailablePrinters } from '../services/printerService.js'
import store from '../services/storeService.js'

ipcMain.on('closeWindow', (event) => {
    BrowserWindow.getAllWindows()
        .find(window => window.id === event.frameId)
        ?.minimize()
})

ipcMain.handle('getCoreData', () => {
    return store.store
})

ipcMain.handle('getAvailablePrinters', () => {
    return getAvailablePrinters()
})

ipcMain.on('setCoreData', (event, value: App.Config) => {
    store.set(value)

    app.setLoginItemSettings({
        openAtLogin: value.openOnStartUp,
    })
})
