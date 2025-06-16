export interface AppInitConfig {
    preload: {
        path: string
    }

    renderer: URL | {
        path: string
    }
}
