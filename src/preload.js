import electron from 'electron';
import binaryUtils from './core/utils/restore/binariesUtils';

const {contextBridge, ipcRenderer} = electron;



contextBridge.exposeInMainWorld('versions', {
    restoreDb: (dbOptions) => ipcRenderer.send('restore-db', dbOptions),
    handleRestoreConsoleEvent: (callback) => ipcRenderer.on('restore-logs', callback),
    getBinaries: () => binaryUtils(),
    electronAll: () => {

        return {
            app: electron
        }
    }
    // también podemos exponer variables, no sólo funciones
});
