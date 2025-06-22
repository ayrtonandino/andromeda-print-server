import type { BrowserWindow } from 'electron'
import { Menu, Tray } from 'electron'
import icon from './GetAppTrayIcon.js'

export function CreateAppTray(mainWindow: BrowserWindow) {
    const tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: import.meta.env.VITE_APP_VERSION || 'DEVELOPMENT',
            role: 'about',
        },
        { type: 'separator' },
        {
            label: 'Config',
            click() {
                mainWindow.show()
            },
        },
        { type: 'separator' },
        {
            label: 'Close',
            role: 'quit',
        },
    ])

    tray.on('double-click', () => {
        mainWindow.show()
    })

    tray.setToolTip('Andromeda Thermal Print Server')

    tray.setContextMenu(contextMenu)

    return tray
}
