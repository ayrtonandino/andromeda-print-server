import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { app } from 'electron'

const isSmokeTest = process.env.ANDROMEDA_SMOKE_TEST === 'true'

if (isSmokeTest && process.env.ANDROMEDA_SMOKE_TEST_USER_DATA) {
    app.setPath('userData', process.env.ANDROMEDA_SMOKE_TEST_USER_DATA)
}

if (process.env.NODE_ENV === 'development' || process.env.PLAYWRIGHT_TEST === 'true' || !!process.env.CI || isSmokeTest) {
    function showAndExit(...args) {
        console.error(...args)
        process.exit(1)
    }

    process.on('uncaughtException', showAndExit)
    process.on('unhandledRejection', showAndExit)
}

if (isSmokeTest) {
    app.once('browser-window-created', (_event, window) => {
        window.webContents.once('did-finish-load', () => {
            console.warn('Smoke test passed: renderer loaded.')
            if (process.env.ANDROMEDA_SMOKE_TEST_RESULT) {
                writeFileSync(process.env.ANDROMEDA_SMOKE_TEST_RESULT, 'renderer-loaded')
            }
            app.exit(0)
        })

        window.webContents.once('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
            if (isMainFrame) {
                console.error(`Smoke test failed to load renderer (${errorCode}): ${errorDescription} (${validatedURL})`)
                app.exit(1)
            }
        })
    })
}

// noinspection JSIgnoredPromiseFromCall
/**
 * We resolve '@app/renderer' and '@app/preload'
 * here and not in '@app/main'
 * to observe good practices of modular design.
 * This allows fewer dependencies and better separation of concerns in '@app/main'.
 * Thus,
 * the main module remains simplistic and efficient
 * as it receives initialization instructions rather than direct module imports.
 */
const { initApp } = await import('@app/main')

initApp(
    {
        renderer: (process.env.MODE === 'development' && !!process.env.VITE_DEV_SERVER_URL)
            ? new URL(process.env.VITE_DEV_SERVER_URL)
            : {
                path: fileURLToPath(import.meta.resolve('@app/renderer')),
            },

        preload: {
            path: fileURLToPath(import.meta.resolve('@app/preload/exposed.mjs')),
        },
    },
)
