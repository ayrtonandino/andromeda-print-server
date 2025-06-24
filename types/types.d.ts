declare namespace App {
    export type PrinterEnum = import('node-thermal-printer').PrinterTypes

    export interface Config {
        printerModel: App.PrinterEnum
        printerUrl: string
        printerPort: number
        openOnStartUp: boolean
        ticketShowClient: boolean
        ticketShowItems: boolean
        ticketShowQr: boolean
    }

    export interface Api {
        closeWindow: () => void
        getCoreData: () => App.Config
        setCoreData: (value: App.Config) => void
        getAvailablePrinters: () => App.PrinterEnum[]
    }
}
