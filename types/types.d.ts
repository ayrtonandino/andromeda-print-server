declare namespace App {
    export interface Config {
        printerModel: import('node-thermal-printer').PrinterTypes
        printerUrl: string
        printerPort: number
    }

    export interface Api {
        closeWindow: () => void
        getCoreData: () => App.Config
        setCoreData: (value: App.Config) => void
        getAvailablePrinters: () => string[]
    }
}
