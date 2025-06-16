import { ipcRenderer } from 'electron'
import { sha256sum } from './nodeCrypto.js'
import { versions } from './versions.js'

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message)
}

export { send, sha256sum, versions }
