import type { BrowserWindow } from 'electron'
import { app, Menu, Tray } from 'electron'
import icon from './GetAppTrayIcon.js'

export function createAppTray(mainWindow: BrowserWindow) {
    const tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: app.getVersion() || 'DEVELOPMENT',
            role: 'about',
        },
        { type: 'separator' },
        {
            label: 'Configurar',
            click() {
                mainWindow.show()
            },
        },
        { type: 'separator' },
        {
            label: 'Cerra',
            role: 'quit',
        },
    ])

    tray.on('double-click', () => {
        mainWindow.show()
    })

    tray.setToolTip('Andromeda Print Server')

    tray.setContextMenu(contextMenu)

    return tray
}
