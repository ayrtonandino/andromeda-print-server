import type { printer as printerType } from 'node-thermal-printer'
import { Joi } from 'express-validation'

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
        const description = getDescription(tag)

        printer.alignCenter()

        printer.code128(code, {
            height: 110,
            width: 'LARGE',
            text: 4,
        })

        printer.println(code)

        printer.setTypeFontB()
        printer.println(description)
        printer.setTypeFontA()

        printer.cut()
    })
}

function getDescription(tag: TagData): string {
    let description = tag.producto

    if (tag.color) {
        description += ` ${tag.color}`
    }

    if (tag.talle) {
        description += ` ${tag.talle}`
    }

    return description.toUpperCase()
}

export { createTag, tagValidation }
