import type { printer as printerType } from 'node-thermal-printer'
import { Buffer } from 'node:buffer'
import { Joi } from 'express-validation'
import { DateTime } from 'luxon'
import { appConfigStore } from './storeService.js'

export const facturaBValidation = {
    body: Joi.object<FacturaBData>({
        comprobante: Joi.object({
            codigo: Joi.number().integer().positive().required(),
            puntoVenta: Joi.number().integer().positive().required(),
            numero: Joi.number().integer().positive().required(),
            fechaEmision: Joi.string().isoDate().required(),
        }).required(),
        emisor: Joi.object({
            razonSocial: Joi.string().required(),
            cuit: Joi.string().required(),
            domicilioComercial: Joi.string().required(),
            ingresosBrutos: Joi.string().required(),
            condicionIva: Joi.string().required(),
            inicioActividades: Joi.string().required(),
        }).required(),
        receptor: Joi.object({
            tipoDocumento: Joi.string().required(),
            numeroDocumento: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
            nombreApellido: Joi.string().required(),
            condicionIva: Joi.string().required(),
            condicionVenta: Joi.string().required(),
        }).required(),
        articulos: Joi.array()
            .items(
                Joi.object({
                    codigo: Joi.string().required(),
                    producto: Joi.string().required(),
                    cantidad: Joi.number().required(),
                    importeTotal: Joi.number().required(),
                }),
            )
            .min(1)
            .required(),
        descuento: Joi.number().min(0).allow(null).optional(),
        importeTotalEnLetras: Joi.string().optional(),
        importeNetoGravado: Joi.number().required(),
        ivaContenido: Joi.number().required(),
        otrosImpuestosNacionalesIndirectos: Joi.number().required(),
        porcentajeImpuestosProvinciales: Joi.number().min(0).allow(null).optional(),
        importeTotal: Joi.number().required(),
        cae: Joi.string().required(),
        fechaVencimientoCae: Joi.string().isoDate().required(),
        qr_data: Joi.string().required(),
    }),
}

export function createFacturaBTicket(printer: printerType, data: FacturaBData): void {
    addComprobante(printer, data)
    addEmisor(printer, data)
    addReceptor(printer, data)
    addArticulos(printer, data)
    addImportes(printer, data)
    addAutorizacion(printer, data)
    finishPrint(printer)
}

function addComprobante(printer: printerType, data: FacturaBData): void {
    printer.drawLine()
    printer.alignCenter()
    printer.bold(true)
    printer.println('ORIGINAL')
    printer.println('FACTURA B')
    printer.bold(false)
    printer.println(`COD. ${data.comprobante.codigo}`)
    printer.alignLeft()

    printer.println(`PUNTO DE VENTA: ${String(data.comprobante.puntoVenta).padStart(5, '0')}`)
    printer.println(`COMP. NRO: ${String(data.comprobante.numero).padStart(8, '0')}`)
    printer.println(`FECHA DE EMISION: ${formatDate(data.comprobante.fechaEmision)}`)
    printer.drawLine()
}

function addEmisor(printer: printerType, data: FacturaBData): void {
    printer.bold(true)
    printer.println(data.emisor.razonSocial.toUpperCase())
    printer.bold(false)
    printer.println(`DOMICILIO COMERCIAL: ${data.emisor.domicilioComercial}`)
    printer.println(`CUIT: ${data.emisor.cuit}`)
    printer.println(`INGRESOS BRUTOS: ${data.emisor.ingresosBrutos}`)
    printer.println(`CONDICION FRENTE AL IVA: ${data.emisor.condicionIva}`)
    printer.println(`INICIO DE ACTIVIDADES: ${formatDate(data.emisor.inicioActividades)}`)
    printer.drawLine()
}

function addReceptor(printer: printerType, data: FacturaBData): void {
    const facturaBShowClient = appConfigStore.get('facturaBShowClient')

    if (!facturaBShowClient) {
        return
    }

    printer.println(`DOCUMENTO: ${data.receptor.tipoDocumento} ${data.receptor.numeroDocumento}`)
    printer.println(`APELLIDO Y NOMBRE: ${data.receptor.nombreApellido}`)
    printer.println(`CONDICION FRENTE AL IVA: ${data.receptor.condicionIva}`)
    printer.println(`CONDICIONES: ${data.receptor.condicionVenta}`)
    printer.drawLine()
}

function addArticulos(printer: printerType, data: FacturaBData): void {
    const facturaBShowItems = appConfigStore.get('facturaBShowItems')

    if (!facturaBShowItems) {
        return
    }

    printer.setTypeFontB()
    printer.println('CODIGO  PRODUCTO  UNIDADES  SUBTOTAL C/IVA')

    data.articulos.forEach((articulo) => {
        printer.bold(true)
        printer.println(articulo.codigo)
        printer.bold(false)
        printer.println(`${articulo.producto} x ${articulo.cantidad}`)
        printer.alignRight()
        printer.println(formatMoney(articulo.importeTotal))
        printer.alignLeft()
    })

    printer.setTypeFontA()
    printer.drawLine()
}

function addImportes(printer: printerType, data: FacturaBData): void {
    if (data.descuento !== undefined && data.descuento !== null && data.descuento > 0) {
        printer.println(`DESCUENTO: ${formatMoney(data.descuento)}`)
    }

    printer.println(`IMPORTE NETO GRAVADO: ${formatMoney(data.importeNetoGravado)}`)
    printer.println('REGIMEN DE TRANSPARENCIA FISCAL AL CONSUMIDOR (LEY 27.743)')
    printer.println(`IVA CONTENIDO: ${formatMoney(data.ivaContenido)}`)
    printer.println(`OTROS IMPUESTOS NACIONALES INDIRECTOS: ${formatMoney(data.otrosImpuestosNacionalesIndirectos)}`)

    if (data.porcentajeImpuestosProvinciales !== undefined && data.porcentajeImpuestosProvinciales !== null && data.porcentajeImpuestosProvinciales > 0) {
        printer.println(`IMPUESTOS PROVINCIALES: ${formatPercentage(data.porcentajeImpuestosProvinciales)}`)
    }

    printer.bold(true)
    printer.println(`IMPORTE TOTAL: ${formatMoney(data.importeTotal)}`)
    printer.bold(false)

    if (data.importeTotalEnLetras) {
        printer.alignCenter()
        printer.println(`SON: ${data.importeTotalEnLetras}`)
        printer.alignLeft()
    }

    printer.drawLine()
}

function addAutorizacion(printer: printerType, data: FacturaBData): void {
    printer.println(`CAE: ${data.cae}`)
    printer.println(`FECHA DE VTO. DE CAE: ${formatDate(data.fechaVencimientoCae)}`)

    const facturaBShowQr = appConfigStore.get('facturaBShowQr')

    if (!facturaBShowQr) {
        return
    }

    printer.newLine()
    printer.alignCenter()
    printer.printQR(
        Buffer.from(data.qr_data, 'utf8').toString('base64'),
        {
            cellSize: 6,
            correction: 'L',
            model: 2,
        },
    )
    printer.newLine()
    printer.alignLeft()
}

function formatDate(value: string): string {
    return DateTime.fromISO(value).toFormat('dd/MM/yyyy')
}

function formatMoney(value: number): string {
    return `$ ${new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)}`
}

function formatPercentage(value: number): string {
    return `${new Intl.NumberFormat('es-AR', {
        maximumFractionDigits: 2,
    }).format(value)}%`
}

function finishPrint(printer: printerType): void {
    const printerUseCut = appConfigStore.get('printerUseCut')

    printerUseCut ? printer.cut() : printer.drawLine()
}
