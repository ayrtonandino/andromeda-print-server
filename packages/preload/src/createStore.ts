import type { Schema } from 'electron-store'
import Store from 'electron-store'

const schema: Schema<App.Config> = {
    printerUrl: {
        type: 'string',
        format: 'uri',
        default: 'tcp://192.168.123.123',
    },
    printerModel: {
        type: 'string',
        enum: ['EPSON', 'STAR'],
        default: 'EPSON',
    },
}

export default new Store({
    schema,
})
