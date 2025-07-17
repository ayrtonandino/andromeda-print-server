import type { AppModule } from '../AppModule.js'
import type { ModuleContext } from '../ModuleContext.js'
import { appConfigStore } from '../services/storeService.js'

export class LoginItemSettingsModule implements AppModule {
    enable({ app }: ModuleContext): Promise<void> | void {
        const userPrefersLogin = appConfigStore.get('openOnStartUp')

        app.setLoginItemSettings({
            openAtLogin: userPrefersLogin,
            openAsHidden: true,
            enabled: true,
        })
    }
}

export function loginSettings(...args: ConstructorParameters<typeof LoginItemSettingsModule>) {
    return new LoginItemSettingsModule(...args)
}
