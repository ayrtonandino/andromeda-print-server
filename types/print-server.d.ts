interface TicketData {
    id: number
    fecha: string
    fechaCambio: string
    sucursal?: {
        nombre: string
        domicilio?: string | null
    }
    cliente?: {
        dni: number
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

interface FacturaBData {
    comprobante: {
        codigo: number
        puntoVenta: number
        numero: number
        fechaEmision: string
    }
    emisor: {
        razonSocial: string
        cuit: string
        domicilioComercial: string
        ingresosBrutos: string
        condicionIva: string
        inicioActividades: string
    }
    receptor: {
        tipoDocumento: string
        numeroDocumento: string | number
        nombreApellido: string
        condicionIva: string
        condicionVenta: string
    }
    articulos: {
        codigo: string
        producto: string
        cantidad: number
        importeTotal: number
    }[]
    descuento?: number | null
    importeTotalEnLetras?: string
    importeNetoGravado: number
    ivaContenido: number
    otrosImpuestosNacionalesIndirectos: number
    porcentajeImpuestosProvinciales?: number | null
    importeTotal: number
    cae: string
    fechaVencimientoCae: string
    qr_data: string
}

interface TagData {
    codigo: string
    producto: string
    color?: string | null
    talle?: string | null
}
