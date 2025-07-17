declare namespace App {
    export type PrinterEnum = import('node-thermal-printer').PrinterTypes

    export interface Config {
        printerModel: App.PrinterEnum
        serverPort: number
        printerUrl: string
        printerPort: number
        openOnStartUp: boolean
        ticketShowDisclaimer: boolean
        ticketShowSucursal: boolean
        ticketShowClient: boolean
        ticketShowItems: boolean
        ticketShowQr: boolean
    }

    export interface Api {
        closeWindow: () => void
        getCoreData: () => Promise<App.Config>
        setCoreData: (value: App.Config) => void
        getAvailablePrinters: () => Promise<App.PrinterEnum[]>
    }
}
