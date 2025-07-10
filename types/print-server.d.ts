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

interface TagData {
    codigo: string
    producto: string
    color?: string | null
    talle?: string | null
}
