import type { AppInitConfig } from '../AppInitConfig.js'
import type { AppModule } from '../AppModule.js'
import type { ModuleContext } from '../ModuleContext.js'
import { BrowserWindow } from 'electron'
import { startExpressServer } from '../services/serverService.js'
import { createAppTray } from './CreateAppTray.js'

import './CreateAppIpc'

class WindowManager implements AppModule {
    readonly #preload: { path: string }
    readonly #renderer: { path: string } | URL
    readonly #openDevTools

    constructor({ initConfig, openDevTools = false }: { initConfig: AppInitConfig, openDevTools?: boolean }) {
        this.#preload = initConfig.preload
        this.#renderer = initConfig.renderer
        this.#openDevTools = openDevTools
    }

    async enable({ app }: ModuleContext): Promise<void> {
        await app.whenReady()

        startExpressServer()

        const mainWindow = await this.restoreOrCreateWindow(true)

        createAppTray(mainWindow)

        app.on('second-instance', () => this.restoreOrCreateWindow(true))
        app.on('activate', () => this.restoreOrCreateWindow(true))
    }

    async createWindow(): Promise<BrowserWindow> {
        const browserWindow = new BrowserWindow({
            show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
            titleBarStyle: 'hidden',
            width: 920,
            height: 520,
            resizable: false,
            maximizable: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
                webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
                preload: this.#preload.path,
            },
        })

        browserWindow.on('minimize', () => {
            browserWindow.setSkipTaskbar(true)
        })

        browserWindow.on('restore', () => {
            browserWindow.setSkipTaskbar(false)
        })

        if (this.#renderer instanceof URL) {
            await browserWindow.loadURL(this.#renderer.href)
        } else {
            await browserWindow.loadFile(this.#renderer.path)
        }

        return browserWindow
    }

    async restoreOrCreateWindow(show = false) {
        let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

        if (window === undefined) {
            window = await this.createWindow()
        }

        if (!show) {
            return window
        }

        if (window.isMinimized()) {
            window.restore()
        }

        window?.show()

        if (this.#openDevTools) {
            window?.webContents.openDevTools()
        }

        window.focus()

        return window
    }
}

export function createWindowManagerModule(...args: ConstructorParameters<typeof WindowManager>) {
    return new WindowManager(...args)
}
