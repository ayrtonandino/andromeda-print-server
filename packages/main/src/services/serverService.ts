/* eslint-disable no-console */
import type { NextFunction, Request, Response } from 'express'
import type { ThermalPrinter } from 'node-thermal-printer'
import type http from 'node:http'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { validate, ValidationError } from 'express-validation'
import { createFacturaBTicket, facturaBValidation } from './facturaBTicketService.js'
import { getPrinter } from './printerService.js'
import { appConfigStore } from './storeService.js'
import { createTag, tagValidation } from './tagService.js'
import { createTicket, ticketValidation } from './ticketService.js'

const expressApp = express()

let server: http.Server | null = null

expressApp.use(cors({
    origin: '*',
}))

expressApp.use(bodyParser.urlencoded({ extended: false }))

expressApp.use(bodyParser.json())

expressApp.get('/connection', async (request, response) => {
    response.json({
        status: 'ok',
        message: 'Conexión establecida correctamente.',
    })
})

expressApp.get('/status', async (request, response) => {
    try {
        console.log('Printer test connection')

        const printer = getPrinter()

        const isConnected = await printer.isPrinterConnected()

        console.log('Printer is Connected ', isConnected)

        if (!isConnected) {
            return response.status(400).json({
                status: 'error',
                message: 'La impresora no está conectada.',
                datosImpresora: {
                    modelo: appConfigStore.get('printerModel'),
                    direccion: appConfigStore.get('printerUrl'),
                    puerto: appConfigStore.get('printerPort'),
                },
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: 'No se pudo comprobar la conexión con la impresora.',
        })
    }

    response.json({ status: 'ok', message: 'El servidor está en línea.' })
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
                message: 'La impresora no está conectada.',
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: 'No se pudo conectar con la impresora.',
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
            message: 'No se pudo imprimir el ticket de cambio.',
        })
    }

    response.json({ status: 'ok', message: 'El ticket de cambio se imprimió correctamente.' })
})

expressApp.post('/print/factura-b', validate(facturaBValidation, { keyByField: true }, {}), async (request, response) => {
    let printer: ThermalPrinter | null = null

    try {
        console.log('Print Factura B start!')

        printer = getPrinter()

        const isConnected = await printer.isPrinterConnected()

        if (!isConnected) {
            return response.status(400).json({
                status: 'error',
                message: 'La impresora no está conectada.',
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: 'No se pudo conectar con la impresora.',
        })
    }

    try {
        console.info('Create Factura B ticket')

        createFacturaBTicket(printer, request.body)

        await printer.execute()

        console.log('Print Factura B success!')
    } catch (error: any) {
        console.error('Print error:', error)

        return response.status(500).json({
            status: 'error',
            message: 'No se pudo imprimir la factura B.',
        })
    }

    response.json({ status: 'ok', message: 'La factura B se imprimió correctamente.' })
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
                message: 'La impresora no está conectada.',
            })
        }
    } catch (error: any) {
        console.error('Print connection error:', error)

        return response.status(500).json({
            status: 'error',
            message: 'No se pudo conectar con la impresora.',
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
            message: 'No se pudo imprimir la etiqueta.',
        })
    }

    response.json({ status: 'ok', message: 'La etiqueta se imprimió correctamente.' })
})

expressApp.use((request, response) => {
    response.status(404).json({
        status: 'error',
        message: 'No se encontró el recurso solicitado.',
    })
})

expressApp.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    if (response.headersSent) {
        return next(error)
    }

    if (error instanceof ValidationError) {
        console.error('Validation error:', error)

        return response.status(error.statusCode).json({
            status: 'error',
            message: 'Los datos enviados no son válidos.',
        })
    }

    console.error('Request error:', error)

    const statusCode = typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
        ? error.status
        : 500

    return response.status(statusCode).json({
        status: 'error',
        message: statusCode === 400
            ? 'No se pudo procesar la solicitud. Verifique los datos enviados.'
            : 'Ocurrió un error interno al procesar la solicitud.',
    })
})

export function startExpressServer(newPort?: number) {
    const serverPort = newPort || appConfigStore.get('serverPort')

    server = expressApp.listen(serverPort, () => console.log(`Server running on port ${serverPort}!`))
}

export function restartExpressServer(newPort: number, oldPort?: number) {
    if (server !== null) {
        server.close(() => {
            console.log(`Server stopped on previous port ${oldPort}!`)

            server = expressApp.listen(newPort, () => console.log(`Server restarted on port ${newPort}!`))
        })

        return
    }

    startExpressServer()
}
