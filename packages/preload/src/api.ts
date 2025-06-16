import configStore from './createStore.js'

export function getCoreData(): App.Config {
    return configStore.store
}

export function setCoreData(value: object): void {
    return configStore.set(value)
}

export function getConfigValue(key: string): string | number {
    return configStore.get(key)
}

export function setConfigValue(key: string, value: object | string | number): void {
    return configStore.set(key, value)
}

export const api = {
    getCoreData,
    setCoreData,
    getConfigValue,
    setConfigValue,
}
