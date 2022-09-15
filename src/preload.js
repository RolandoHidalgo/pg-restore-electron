import electron from 'electron';
import binaryUtils from './core/utils/restore/binariesUtils';
import {GlobalConfig} from "@/core/utils/restore/GlobalConfig";

const {contextBridge, ipcRenderer,app} = electron;



contextBridge.exposeInMainWorld('versions', {
    restoreDb: (dbOptions) => ipcRenderer.send('restore-db', dbOptions),
    handleRestoreConsoleEvent: (callback) => ipcRenderer.on('restore-logs', callback),
    getBinaries: () => binaryUtils(),
    getFileArg:()=>{

        return ipcRenderer.invoke('file-args');
    },
    electronAll: () => {

        return {
            app: electron
        }
    }
    // también podemos exponer variables, no sólo funciones
});
