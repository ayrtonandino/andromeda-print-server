import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
import { appConfigStore } from './storeService.js'

export function getAvailablePrinters(): PrinterTypes[] {
    return Object.values(PrinterTypes)
}

function newPrinter(model: App.PrinterEnum, url: string, port: number): ThermalPrinter {
    return new ThermalPrinter({
        type: model,
        interface: `${url}:${port}`,
    })
}

function getPrinter(): ThermalPrinter {
    return newPrinter(
        appConfigStore.get('printerModel'),
        appConfigStore.get('printerUrl'),
        appConfigStore.get('printerPort'),
    )
}

export { getPrinter, newPrinter }
