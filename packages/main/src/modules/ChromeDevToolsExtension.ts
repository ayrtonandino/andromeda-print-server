import type { AppModule } from '../AppModule.js'
import type { ModuleContext } from '../ModuleContext.js'
import {
    BACKBONE_DEBUGGER,
    EMBER_INSPECTOR,
    installExtension,
    JQUERY_DEBUGGER,
    MOBX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
    VUEJS_DEVTOOLS,
} from 'electron-devtools-installer'

const extensionsDictionary = {
    BACKBONE_DEBUGGER,
    EMBER_INSPECTOR,
    JQUERY_DEBUGGER,
    MOBX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
    VUEJS_DEVTOOLS,
} as const

export class ChromeDevToolsExtension implements AppModule {
    readonly #extension: keyof typeof extensionsDictionary

    constructor({ extension }: { readonly extension: keyof typeof extensionsDictionary }) {
        this.#extension = extension
    }

    async enable({ app }: ModuleContext): Promise<void> {
        await app.whenReady()
        await installExtension(extensionsDictionary[this.#extension])
    }
}

export function chromeDevToolsExtension(...args: ConstructorParameters<typeof ChromeDevToolsExtension>) {
    return new ChromeDevToolsExtension(...args)
}
