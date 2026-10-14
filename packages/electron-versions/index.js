import { execSync } from 'node:child_process'
import process from 'node:process'

function getElectronEnv() {
    const output = execSync(
        `npx electron -p "JSON.stringify(process.versions)"`,
        {
            encoding: 'utf-8',
            env: {
                ...process.env,
                ELECTRON_RUN_AS_NODE: 1,
            },
        },
    )

    const versionsJson = output
        .trim()
        .split(/\r?\n/)
        .reverse()
        .find((line) => {
            try {
                JSON.parse(line)
                return true
            } catch {
                return false
            }
        })

    if (!versionsJson) {
        throw new SyntaxError(`Electron did not return version information: ${output}`)
    }

    return JSON.parse(versionsJson)
}

function createElectronEnvLoader() {
    let inMemoryCache = null

    return () => {
        if (inMemoryCache) {
            return inMemoryCache
        }

        return inMemoryCache = getElectronEnv()
    }
}

const envLoader = createElectronEnvLoader()

export function getElectronVersions() {
    return envLoader()
}

export function getChromeVersion() {
    return getElectronVersions().chrome
}

export function getChromeMajorVersion() {
    return getMajorVersion(getChromeVersion())
}

export function getNodeVersion() {
    return getElectronVersions().node
}

export function getNodeMajorVersion() {
    return getMajorVersion(getNodeVersion())
}

function getMajorVersion(version) {
    return Number.parseInt(version.split('.')[0])
}
