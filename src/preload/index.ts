import {contextBridge, ipcRenderer} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'

const api = {
    restoreDb: (dbOptions) => ipcRenderer.send('restore-db', dbOptions),
    createDb: (dbOptions) => ipcRenderer.send('create-db', dbOptions),
    restoreFinish: () => ipcRenderer.send('restore-finish'),
    handleRestoreConsoleEvent: (callback) => ipcRenderer.on('restore-logs', callback),
    getBinaries: () => ipcRenderer.invoke('get-binaries'),
    getFileArg: () => {

        return ipcRenderer.invoke('file-args');
    },
    electronAll: () => {

        return {
            app: electronAPI
        }
    }
    // también podemos exponer variables, no sólo funciones
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        //contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('electron', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
