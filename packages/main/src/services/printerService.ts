import { CharacterSet, PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
import { appConfigStore } from './storeService.js'

export function getAvailablePrinters(): PrinterTypes[] {
    return Object.values(PrinterTypes)
}

export function newWebPrinter(model: App.PrinterEnum, url: string, port: number): ThermalPrinter {
    return new ThermalPrinter({
        type: model,
        interface: `${url}:${port}`,
        characterSet: CharacterSet.WPC1252,
    })
}

export function getPrinter(): ThermalPrinter {
    return newWebPrinter(
        appConfigStore.get('printerModel'),
        appConfigStore.get('printerUrl'),
        appConfigStore.get('printerPort'),
    )
}
