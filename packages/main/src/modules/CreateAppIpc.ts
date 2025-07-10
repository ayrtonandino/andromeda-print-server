import { app, BrowserWindow, ipcMain } from 'electron'

ipcMain.on('closeWindow', (event) => {
    BrowserWindow.getAllWindows()
        .find(window => window.id === event.frameId)
        ?.minimize()
})

ipcMain.on('updateOpenOnStartUp', (event, value: boolean) => {
    app.setLoginItemSettings({
        openAtLogin: value,
    })
})
