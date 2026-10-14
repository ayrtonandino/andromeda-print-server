import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

const executablePath = process.platform === 'win32'
    ? join('dist', 'win-unpacked', 'AndromedaPrintServer.exe')
    : process.platform === 'darwin'
        ? join('dist', 'mac', 'AndromedaPrintServer.app', 'Contents', 'MacOS', 'AndromedaPrintServer')
        : join('dist', 'linux-unpacked', 'AndromedaPrintServer')

try {
    await access(executablePath)
} catch {
    throw new Error(`No se encontró la aplicación compilada en "${executablePath}". Ejecute "yarn compile" antes del smoke test.`)
}

const smokeUserDataPath = await mkdtemp(join(tmpdir(), 'andromeda-smoke-'))
const smokeResultPath = join(smokeUserDataPath, `${randomUUID()}.txt`)
const maxOutputLength = 20_000
let output = ''

function appendOutput(chunk) {
    output += chunk.toString()

    if (output.length > maxOutputLength) {
        output = output.slice(-maxOutputLength)
    }
}

const child = spawn(executablePath, [], {
    env: {
        ...process.env,
        ANDROMEDA_SMOKE_TEST: 'true',
        ANDROMEDA_SMOKE_TEST_RESULT: smokeResultPath,
        ANDROMEDA_SMOKE_TEST_USER_DATA: smokeUserDataPath,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
})

child.stdout.on('data', appendOutput)
child.stderr.on('data', appendOutput)

const timeout = setTimeout(() => {
    child.kill()
}, 60_000)

try {
    const exitCode = await new Promise((resolve, reject) => {
        child.once('error', reject)
        child.once('close', (code, signal) => {
            resolve({ code, signal })
        })
    })

    const smokeResult = await readFile(smokeResultPath, 'utf8').catch(() => '')

    if (exitCode.code !== 0 || smokeResult !== 'renderer-loaded') {
        throw new Error(`La aplicación no inició correctamente (código ${exitCode.code ?? `señal ${exitCode.signal}`}):\n${output}`)
    }

    console.info('Smoke test passed: packaged application started and loaded the renderer.')
} finally {
    clearTimeout(timeout)
    await rm(smokeUserDataPath, { force: true, recursive: true })
}
