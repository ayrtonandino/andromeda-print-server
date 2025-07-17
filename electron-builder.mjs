import { join } from 'node:path'
import { cwd } from 'node:process'
import { pathToFileURL } from 'node:url'
import mapWorkspaces from '@npmcli/map-workspaces'
import pkg from './package.json' with { type: 'json' }

export default /** @type import('electron-builder').Configuration */
    ({
        directories: {
            output: 'dist',
            buildResources: 'buildResources',
        },
        generateUpdatesFilesForAllChannels: true,
        electronLanguages: ['en-US', 'es'],
        linux: {
            target: ['deb'],
        },
        /**
         * It is recommended to avoid using non-standard characters such as spaces in artifact names,
         * as they can unpredictably change during deployment, making them impossible to locate and download for update.
         */
        // eslint-disable-next-line no-template-curly-in-string
        artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
        files: [
            'LICENSE*',
            pkg.main,
            '!node_modules/@app/**',
            ...await getListOfFilesFromEachWorkspace(),
        ],
    })

async function getListOfFilesFromEachWorkspace() {
    /**
     * @type {Map<string, string>}
     */
    const workspaces = await mapWorkspaces({
        cwd: cwd(),
        pkg,
    })

    const allFilesToInclude = []

    for (const [name, path] of workspaces) {
        const pkgPath = join(path, 'package.json')
        const { default: workspacePkg } = await import(pathToFileURL(pkgPath), { with: { type: 'json' } })

        let patterns = workspacePkg.files || ['dist/**', 'package.json']

        patterns = patterns.map(p => join('node_modules', name, p))
        allFilesToInclude.push(...patterns)
    }

    return allFilesToInclude
}
