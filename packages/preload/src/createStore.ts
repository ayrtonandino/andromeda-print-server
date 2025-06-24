import type { Schema } from 'electron-store'
import Store from 'electron-store'
import { getAvailablePrinters } from './api.js'

const models = getAvailablePrinters()

const schema: Schema<App.Config> = {
    serverPort: {
        type: 'number',
        maximum: 65535,
        minimum: 0,
        default: 3005,
    },
    printerModel: {
        type: 'string',
        enum: models,
        default: models[0],
    },
    printerUrl: {
        type: 'string',
        format: 'uri',
        default: 'tcp://192.168.123.123',
    },
    printerPort: {
        type: 'number',
        maximum: 65535,
        minimum: 0,
        default: 9100,
    },
    openOnStartUp: {
        type: 'boolean',
        default: true,
    },
    ticketShowClient: {
        type: 'boolean',
        default: true,
    },
    ticketShowItems: {
        type: 'boolean',
        default: true,
    },
    ticketShowQr: {
        type: 'boolean',
        default: true,
    },
}

export default new Store({
    schema,
})
