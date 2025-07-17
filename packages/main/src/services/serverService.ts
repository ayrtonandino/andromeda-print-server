/* eslint-disable no-console */
import type { ThermalPrinter } from 'node-thermal-printer'
import type http from 'node:http'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { validate, ValidationError } from 'express-validation'
import { getPrinter } from './printerService.js'
import { appConfigStore } from './storeService.js'
import { createTag, tagValidation } from './tagService.js'
import { createTicket, ticketValidation } from './ticketService.js'

const expressApp = express()

let server: http.Server | null = null

expressApp.use(cors())

expressApp.use(bodyParser.urlencoded({ extended: false }))

expressApp.use(bodyParser.json())

expressApp.get('/status', async (request, response) => {
    try {
        console.log('Printer test connection')

        const printer = getPrinter()

        const isConnected = await printer.isPrinterConnected()

        console.log('Printer is Connected ', isConnected)

        if (!isConnected) {
            return response.status(400).json({
                error: 'Printer not connected',
                printerData: {
                    printerModel: appConfigStore.get('printerModel'),
                    printerUrl: appConfigStore.get('printerUrl'),
                    printerPort: appConfigStore.get('printerPort'),
                },
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: error.message,
        })
    }

    response.json({ status: 'Server Online' })
})

expressApp.post('/print', validate(ticketValidation, { keyByField: true }, {}), async (request, response) => {
    let printer: ThermalPrinter | null = null

    try {
        console.log('Print start!')

        printer = getPrinter()

        const isConnected = await printer.isPrinterConnected()

        if (!isConnected) {
            return response.status(400).json({
                status: 'error',
                message: 'Printer not connected',
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: error.message,
        })
    }

    try {
        console.info('Create ticket')

        createTicket(printer, request.body)

        await printer.execute()

        console.log('Print success!')
    } catch (error: any) {
        console.error('Print error:', error)

        return response.status(500).json({
            status: 'error',
            message: error.message,
        })
    }

    response.json({ status: 'Print success!' })
})

expressApp.post('/tag', validate(tagValidation, { keyByField: true }, {}), async (request, response) => {
    let printer: ThermalPrinter | null = null

    try {
        console.log('Print tag start!')

        printer = getPrinter()

        const isConnected = await printer.isPrinterConnected()

        if (!isConnected) {
            return response.status(400).json({
                status: 'error',
                message: 'Printer not connected',
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: error.message,
        })
    }

    try {
        console.info('Create tag')

        createTag(printer, request.body)

        await printer.execute()

        console.log('Print tag successful!')
    } catch (error: any) {
        console.error('Print error:', error)

        return response.status(500).json({
            status: 'error',
            message: error.message,
        })
    }

    response.json({ status: 'Print tag successful!' })
})

expressApp.use((error, response) => {
    if (error instanceof ValidationError) {
        console.error('Validation error:', error)

        return response.status(error.statusCode).json({ error })
    }

    return response.status(500).json({ error })
})

export function startExpressServer(newPort?: number) {
    const serverPort = newPort || appConfigStore.get('serverPort')

    server = expressApp.listen(serverPort, () => console.log(`Server running on port ${serverPort}!`))
}

export function restartExpressServer(newPort: number, oldPort?: number) {
    if (server) {
        server.close(() => {
            console.log(`Server stopped on previous port ${oldPort}!`)

            server = expressApp.listen(newPort, () => console.log(`Server restarted on port ${newPort}!`))
        })
    } else {
        startExpressServer()
    }
}
