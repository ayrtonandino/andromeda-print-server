import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
import store from './storeService.js'

export function getAvailablePrinters(): PrinterTypes[] {
    return Object.values(PrinterTypes)
}

function newPrinter(model: PrinterTypes, url: string, port: number) {
    return new ThermalPrinter({
        type: model,
        interface: `${url}:${port}`,
    })
}

function getPrinter() {
    return newPrinter(
        store.get('printerModel'),
        store.get('printerUrl'),
        store.get('printerPort'),
    )
}

export { getPrinter, newPrinter }
