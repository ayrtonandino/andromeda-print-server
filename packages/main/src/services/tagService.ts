import type { printer as printerType } from 'node-thermal-printer'
import { Joi } from 'express-validation'

interface TagData {
    codigo: string
    producto: string
    color?: string | null
    talle?: string | null
}

const tagValidation = {
    body: Joi.array()
        .items(
            Joi.object<TagData>({
                codigo: Joi.string().required(),
                producto: Joi.string().required(),
                color: Joi.string().allow('', null),
                talle: Joi.string().allow('', null),
            }),
        )
        .required(),
}

function createTag(printer: printerType, data: TagData[]): void {
    data.forEach((tag) => {
        const code = String(tag.codigo).toUpperCase()
        const description = String(`${tag.producto} ${tag.color || ''} ${tag.talle || ''}`).toUpperCase()

        printer.alignCenter()

        printer.drawLine()
        printer.newLine()

        printer.code128(code, {
            height: 81,
            width: 'SMALL',
        })

        printer.newLine()

        printer.println(code)

        printer.setTypeFontB()

        printer.println(description)

        printer.setTypeFontA()
        printer.drawLine()

        printer.cut()
    })
}

export { createTag, tagValidation }
