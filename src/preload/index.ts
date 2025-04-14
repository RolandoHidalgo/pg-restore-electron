import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { DataSource, getDatasources } from '../main/utils/restore/dataSourceUtils'
import { DbOptions } from '../main/utils/restore/restore-db'
import path from 'path'

const api = {
  restoreDb: (dbOptions: DbOptions) => {
    const ds: DataSource | undefined = getDatasources().filter(
      (e) => e.name === dbOptions.dsName
    )[0]

    dbOptions.user = ds?.username
    dbOptions.password = ds?.password
    dbOptions.host = ds?.host
    dbOptions.binary = ds?.binary
    dbOptions.port = ds?.port
    console.log(dbOptions, 'optionss')
    return ipcRenderer.send('restore-db', dbOptions)
  },
  sincronizarUsb: (usbDrive: string) => ipcRenderer.send('sincronizar-usb', usbDrive),
  backupDb: (dbOptions: DbOptions) => {
    console.log(dbOptions, 'optionss1')
    const ds: DataSource | undefined = getDatasources().filter(
      (e) => e.name === dbOptions.dsName
    )[0]
    console.log(ds, 'el ds')
    dbOptions.user = ds?.username
    dbOptions.password = ds?.password
    dbOptions.host = ds?.host
    dbOptions.binary = ds?.binary
    dbOptions.port = ds?.port
    console.log(dbOptions, 'optionss')
    ipcRenderer.send('backup-db', dbOptions)
  },
  addDatasource: async (ds: DataSource) => {
    const data: DataSource = {
      name: ds.name,
      binary: ds.binary,
      password: ds.password,
      port: Number(ds.port),
      host: ds.host,
      username: ds.username,
      isDefault: ds.isDefault ?? false
    }

    return ipcRenderer.invoke('add-datasource', data)
  },
  parseBackup: async (dsName: string, backupPath: File | string) => {
    let path: File | string;
    if (typeof backupPath === 'string') {
      path = backupPath
    } else {
      path = webUtils.getPathForFile(backupPath)
    }
    return  ipcRenderer.invoke('parse-backup', dsName, path)
  },
  setDefaultDatasource: async (dsName: string) => {
    return ipcRenderer.invoke('set-default-ds', dsName)
  },
  showFilePath(file) {
    // It's best not to expose the full file path to the web content if
    // possible.
    return webUtils.getPathForFile(file)

    // alert(`Uploaded file path was: ${path}`)
  },
  obtenerVersion: async () => {
    return await ipcRenderer.invoke('obtener-version')
  },
  createDb: (dbOptions: DbOptions, createDbOptions) => {
    const ds: DataSource | undefined = getDatasources().filter(
      (e) => e.name === dbOptions.dsName
    )[0]

    dbOptions.user = ds?.username
    dbOptions.password = ds?.password
    dbOptions.host = ds?.host
    dbOptions.binary = ds?.binary
    dbOptions.port = ds?.port
    console.log(dbOptions, 'optionss')
    return ipcRenderer.send('create-db', dbOptions, createDbOptions)
  },
  cloneDb: (dbOptions: DbOptions, createDbOptions) => {
    const ds: DataSource | undefined = getDatasources().filter(
      (e) => e.name === dbOptions.dsName
    )[0]

    dbOptions.user = ds?.username
    dbOptions.password = ds?.password
    dbOptions.host = ds?.host
    dbOptions.binary = ds?.binary
    dbOptions.port = ds?.port
    console.log(dbOptions, 'optionss')
    return ipcRenderer.send('clone-db', dbOptions, createDbOptions)
  },
  restoreFinish: () => ipcRenderer.send('restore-finish'),
  //updateInfo: (event,data) => ipcRenderer.send(event,data),
  handleRestoreConsoleEvent: (callback) => ipcRenderer.on('restore-logs', callback),
  handleSyncEvent: (callback) => ipcRenderer.on('sync-logs', callback),

  handleUpdateInfo: (callback) => ipcRenderer.on('update-logs', callback),
  getBinaries: () => ipcRenderer.invoke('get-binaries'),
  getDrives: () => ipcRenderer.invoke('get-drives'),
  getDatasource: (): Promise<DataSource[]> => ipcRenderer.invoke('get-datasource'),
  getDbs: async (name: string) => {
    console.log('allamar con name', name)
    return ipcRenderer.invoke('get-dbs', name)
  },
  getSchemmas: async (dsName: string, dbName: string) => {
    return ipcRenderer.invoke('get-schemmas', dsName, dbName)
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
