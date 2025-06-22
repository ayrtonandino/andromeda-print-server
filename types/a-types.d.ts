type Undefinable<T> = {
    [K in keyof T]: T[K] | undefined
}

type Nullable<T> = {
    [K in keyof T]: T[K] | null
}

type DeepNullable<T> = {
    [K in keyof T]: DeepNullable<T[K]> | null
}

type Selectable<T> = T & {
    selected: boolean
}
