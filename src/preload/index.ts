import {contextBridge, ipcRenderer, webUtils} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'
import {DataSource, getDatasources} from "../main/utils/restore/dataSourceUtils";
import {DbOtions} from "../main/utils/restore/restore-db";
import path from "path";

const api = {
  restoreDb: (dbOptions) => {
    const ds: DataSource | undefined = getDatasources().filter(e => e.name === dbOptions.datasource)[0];

    dbOptions.user = ds?.username;
    dbOptions.password = ds?.password;
    dbOptions.host = ds?.host;
    dbOptions.binary = ds?.binary;
    dbOptions.port = ds?.port;
    console.log(dbOptions,'optionss');
    return ipcRenderer.send('restore-db', dbOptions);
  },
  sincronizarUsb: (usbDrive:string) => ipcRenderer.send('sincronizar-usb', usbDrive),
  backupDb: (dbOptions: DbOtions) => {
    console.log(dbOptions,'optionss1');
    const ds: DataSource | undefined = getDatasources().filter(e => e.name === dbOptions.datasource)[0];
    console.log(ds,'el ds');
    dbOptions.user = ds?.username;
    dbOptions.password = ds?.password;
    dbOptions.host = ds?.host;
    dbOptions.binary = ds?.binary;
    dbOptions.port = ds?.port;
    console.log(dbOptions,'optionss');
    ipcRenderer.send('backup-db', dbOptions)
  },
  addDatasource: async (dbOptions: DbOtions) => {
    const ds: DataSource = {
      name: dbOptions.dbName,
      binary: path.dirname(dbOptions.binary),
      password: dbOptions.password,
      port: Number(dbOptions.port),
      host: dbOptions.host,
      username: dbOptions.user
    }

    return ipcRenderer.invoke('add-datasource', ds)
  },
  showFilePath(file) {
    // It's best not to expose the full file path to the web content if
    // possible.
    return webUtils.getPathForFile(file)

    // alert(`Uploaded file path was: ${path}`)
  },
  createDb: (dbOptions, createDbOptions) =>{

    const ds: DataSource | undefined = getDatasources().filter(e => e.name === dbOptions.datasource)[0];

    dbOptions.user = ds?.username;
    dbOptions.password = ds?.password;
    dbOptions.host = ds?.host;
    dbOptions.binary = ds?.binary;
    dbOptions.port = ds?.port;
    console.log(dbOptions,'optionss');
    return ipcRenderer.send('create-db', dbOptions, createDbOptions)
  },

  restoreFinish: () => ipcRenderer.send('restore-finish'),
  //updateInfo: (event,data) => ipcRenderer.send(event,data),
  handleRestoreConsoleEvent: (callback) => ipcRenderer.on('restore-logs', callback),
  handleSyncEvent: (callback) => ipcRenderer.on('sync-logs', callback),

  handleUpdateInfo: (callback) => ipcRenderer.on('update-logs', callback),
  getBinaries: () => ipcRenderer.invoke('get-binaries'),
  getDrives: () => ipcRenderer.invoke('get-drives'),
  getDatasource: () => ipcRenderer.invoke('get-datasource'),
  getDbs: async (name:string) => {
    console.log('allamar con name',name)
    return ipcRenderer.invoke('get-dbs',name)
  },
  getSchemmas: async (dsName:string,dbName:string) => {

  return ipcRenderer.invoke('get-schemmas',dsName,dbName)
},
  checkUpdate: () => ipcRenderer.send('check-update'),
  getFileArg: () => {
    return ipcRenderer.invoke('file-args')
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
