import type { printer as printerType } from 'node-thermal-printer'
import { Joi } from 'express-validation'
import { DateTime } from 'luxon'
import { appConfigStore } from './storeService.js'

const ticketValidation = {
    body: Joi.object<TicketData>({
        id: Joi.number().required(),
        fecha: Joi.string().isoDate().required(),
        fechaCambio: Joi.string().isoDate().required(),

        sucursal: Joi.object({
            nombre: Joi.string().required(),
            domicilio: Joi.string().required(),
        }).required(),

        cliente: Joi.object({
            dni: Joi.any().required(),
            apellido: Joi.string().required(),
            nombre: Joi.string().required(),
        }).required(),

        articulos: Joi.array()
            .items(
                Joi.object({
                    codigo: Joi.string().required(),
                    producto: Joi.string().required(),
                    color: Joi.string().allow('', null),
                    talle: Joi.string().allow('', null),
                    cantidad: Joi.number().required(),
                }),
            )
            .required(),
    }),
}

function createTicket(printer: printerType, data: TicketData): void {
    addDisclaimer(printer)

    addSucursal(printer, data)

    addDates(printer, data)

    addCliente(printer, data)

    addArticulos(printer, data)

    addQr(printer, data)

    addDisclaimer(printer)

    printer.cut()
}

function addDisclaimer(printer: printerType): void {
    printer.drawLine()

    printer.alignCenter()
    printer.bold(true)
    printer.println(String('ticket de cambio').toUpperCase())
    printer.println(String('conservar para cambio').toUpperCase())
    printer.bold(false)
    printer.alignLeft()

    printer.drawLine()
}

function addSucursal(printer: printerType, data: TicketData): void {
    if (data.sucursal) {
        printer.alignCenter()
        printer.setTextQuadArea()
        printer.println(String(data.sucursal.nombre).toUpperCase())
        printer.setTextNormal()

        if (data.sucursal.domicilio) {
            printer.newLine()
            printer.println(String(data.sucursal.domicilio).toUpperCase())
        }

        printer.alignLeft()

        printer.drawLine()
    }
}

function addDates(printer: printerType, data: TicketData): void {
    printer.println(`# ${data.id}`)

    printer.drawLine()

    printer.println(`Fecha de Compra: ${DateTime.fromISO(data.fecha).toFormat('dd/MM/yyyy')}`)
    printer.println(`Fecha limite de Cambio: ${DateTime.fromISO(data.fechaCambio).toFormat('dd/MM/yyyy')}`)

    printer.drawLine()
}

function addCliente(printer: printerType, data: TicketData): void {
    const ticketShowClient = appConfigStore.get('ticketShowClient')

    if (data.cliente && ticketShowClient) {
        printer.println(String(data.cliente.dni))
        printer.println(`${data.cliente.apellido} ${data.cliente.nombre}`)

        printer.drawLine()
    }
}

function addArticulos(printer: printerType, data: TicketData): void {
    const ticketShowItems = appConfigStore.get('ticketShowItems')

    if (data.articulos && ticketShowItems) {
        printer.setTypeFontB()

        data.articulos.forEach((articulo) => {
            printer.bold(true)
            printer.println(articulo.codigo)
            printer.bold(false)
            printer.println(`${articulo.cantidad} UN x ${articulo.producto} ${articulo.color || ''} ${articulo.talle || ''}`)
        })

        printer.setTypeFontA()

        printer.drawLine()
    }
}

function addQr(printer: printerType, data: TicketData): void {
    const ticketShowQr = appConfigStore.get('ticketShowQr')

    if (ticketShowQr) {
        const utf8Bytes = new TextEncoder().encode(JSON.stringify({
            ver: 1,
            id: data.id,
        }))

        printer.alignCenter()
        printer.printQR(
            btoa(String.fromCharCode(...utf8Bytes)),
            {
                cellSize: 6,
                correction: 'L',
                model: 2,
            },
        )
        printer.newLine()

        printer.println(String('comprobante no valido como factura').toUpperCase())
    }
}

export { createTicket, ticketValidation }
