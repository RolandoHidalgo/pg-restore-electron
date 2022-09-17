import electron from 'electron';



const {contextBridge, ipcRenderer, app} = electron;


contextBridge.exposeInMainWorld('versions', {
    restoreDb: (dbOptions) => ipcRenderer.send('restore-db', dbOptions),
    handleRestoreConsoleEvent: (callback) => ipcRenderer.on('restore-logs', callback),
    getBinaries: () => ipcRenderer.invoke('get-binaries'),
    getFileArg: () => {

        return ipcRenderer.invoke('file-args');
    },
    electronAll: () => {

        return {
            app: electron
        }
    }
    // también podemos exponer variables, no sólo funciones
});
