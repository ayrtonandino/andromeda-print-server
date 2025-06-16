import type { printer as printerType } from 'node-thermal-printer'
import { Joi } from 'express-validation'
import { DateTime } from 'luxon'

interface TicketData {
    id: string
    fecha: string
    fechaCambio: string
    sucursal?: {
        nombre: string
        domicilio?: string | null
    }
    cliente?: {
        dni: string
        apellido: string
        nombre: string
    }
    articulos?: {
        cantidad: number
        codigo: string
        producto: string
        color?: string | null
        talle?: string | null
    }[]
}

const ticketValidation = {
    body: Joi.object({
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
    printer.drawLine()

    printer.alignCenter()
    printer.bold(true)
    printer.println(String('ticket de cambio').toUpperCase())
    printer.println(String('conservar para cambio').toUpperCase())
    printer.bold(false)
    printer.alignLeft()

    if (data.sucursal) {
        printer.drawLine()
        printer.alignCenter()
        printer.newLine()
        printer.setTextQuadArea()
        printer.println(String(data.sucursal.nombre).toUpperCase())
        printer.setTextNormal()
        printer.newLine()
        printer.println(String(data.sucursal.domicilio || '').toUpperCase())
        printer.drawLine()
        printer.alignLeft()
    }

    printer.println(`# ${data.id}`)
    printer.drawLine()

    printer.println(`Fecha de Compra: ${DateTime.fromISO(data.fecha).toFormat('dd/MM/yyyy')}`)
    printer.println(`Fecha limite de Cambio: ${DateTime.fromISO(data.fechaCambio).toFormat('dd/MM/yyyy')}`)
    printer.drawLine()

    if (data.cliente) {
        printer.println(data.cliente.dni)
        printer.println(`${data.cliente.apellido} ${data.cliente.nombre}`)
        printer.drawLine()
    }

    if (data.articulos) {
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

    printer.alignCenter()
    printer.printQR(
        JSON.stringify({
            id: data.id,
            fecha: data.fecha,
            fechaCambio: data.fechaCambio,
            cliente: data.cliente,
            sucursal: data.sucursal,
        }),
    )
    printer.drawLine()

    printer.println(String('comprobante no valido como factura').toUpperCase())
    printer.drawLine()

    printer.alignCenter()
    printer.bold(true)
    printer.println(String('ticket de cambio').toUpperCase())
    printer.println(String('conservar para cambio').toUpperCase())
    printer.bold(false)
    printer.alignLeft()

    printer.drawLine()

    printer.cut()
}

export { createTicket, ticketValidation }
